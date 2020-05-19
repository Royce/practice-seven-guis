(ns ^:figwheel-always app.core
  (:require-macros [cljs.core.async.macros :refer [go]])
  (:require [cljs.core.async :refer [chan <! >! put!]]
            [rum :as r]
            [cljs.reader :refer [read-string]]))

(enable-console-print!)

;; state
(def channel (chan))
(defonce app-state (atom {:celcius nil :fahrenheit nil}))
(defn on-js-reload [])

;; View
(r/defc input [state channel key label]
  [:div
   [:input {:type "text"
            :value (or (key state) "")
            :on-change
            (fn [event]
              (let [value (.-value (.-target event))]
                (put! channel {:key key :value value})))
            :id (name key)}]
   [:label {:for (name key)} label]])

(r/defc ui []
  [:div
   [:h1 "Temperture Conversion"]
   (input @app-state channel :fahrenheit "°F")
   " = "
   (input @app-state channel :celcius "°C")])


;; Render it!
(let [component
  (r/mount (ui)
             (.getElementById js/document "app"))]
  (defn render [] (r/request-render component)))



;; Event Handling / Channels
(defn str->int [s]
  (when (and (string? s)
        (re-find #"^\d+$" s))
    (read-string s)))

(def conversions
  {:celcius
   (fn [new] {:celcius new :fahrenheit (+ 32 (* new 1.8))})
   :fahrenheit
   (fn [new] {:celcius (/ (- new 32) 1.8) :fahrenheit new})})

(defn handle-events [{:keys [key value]}]
  (let [parsed (str->int value)]
    (if parsed
      (reset! app-state ((get conversions key) parsed))
      (swap! app-state assoc key value)))
  (render))

(go (while true
  (handle-events (<! channel))))
