(ns ^:figwheel-always conversion-quiescent.core
  (:require-macros [cljs.core.async.macros :refer [go]])
  (:require [cljs.core.async :refer [chan <! >!]]
            [quiescent.core :as q]
            [quiescent.dom :as d]
            [cljs.reader :refer [read-string]]))

(enable-console-print!)

;; state
(def channel (chan))
(defonce app-state (atom {:celcius nil :fahrenheit nil}))
(defn on-js-reload [])

;; View
(q/defcomponent Numeric [state channel key label]
  (d/div {}
         (d/input {:type "text"
                   :value (or (key state) "")
                   :onChange
                   (fn [event]
                     (let [value (.-value (.-target event))]
                       (go (>! channel {:key key :value value}))))
                   :id (name key)})
         (d/label {:htmlFor (name key)} label)))

(q/defcomponent Everything [state]
  (d/div {}
         (d/h1 nil "Temperture Conversion")
         (Numeric state channel :fahrenheit "°F")
         " = "
         (Numeric state channel :celcius "°C")))


;; Render it!
(defn render [state]
  (q/render (Everything state)
            (.getElementById js/document "app")))

(render @app-state)


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
  (render @app-state))

(go (while true
  (handle-events (<! channel))))
