(ns ^:figwheel-always app.core
  (:require-macros [cljs.core.async.macros :refer [go]])
  (:require [cljs.core.async :refer [chan <! >! put!]]
            [rum :as r]
            [cljs.reader :refer [read-string]]
            [cljs-time.coerce :refer [to-local-date]]
            [cljs-time.core
             :refer [before? after? today plus months date?]]
            [cljs-time.format :refer [formatter unparse-local-date]]))

(enable-console-print!)


;; state
(def channel (chan))
(defonce app-state (atom {:type :return
                          :depart (today)
                          :return (plus (today) (months 1))}))
(defn on-js-reload [])


;; View
(r/defc flight-options [state channel key]
  [:select {:value (name (key state))
            :on-change
            (fn [event]
              (let [value (.-value (.-target event))]
                (put! channel {:key key :value (keyword value)})))
            }
   [:option {:value (name :oneway)} "One Way"]
   [:option {:value (name :return)} "Return"]])

(r/defc date [state channel key label]
  (let [value (state key)
        fmt (if (date? value)
              (unparse-local-date (formatter "yyyy-MM-dd") value)
              (str value))
        valid? (date? value)]
    [:div
     [:label {:for (name key)} label]
     [:input {:type "text"
              :value fmt
              :class (if (not valid?) "error")
              :on-change
              (fn [event]
                (let [value (.-value (.-target event))]
                  (put! channel {:key key :value value})))
              :id (name key)}]]))

(r/defc ui []
  (let [state @app-state
        depart-valid? (date? (state :depart))
        return-valid? (date? (state :return))
        return-required? (= (state :type) :return)
        return-after-depart?
        (and return-required?
          depart-valid?
          return-valid?
          (after? (state :return) (state :depart)))
        can-book?
        (and depart-valid?
             (or (not return-required?)
                 (and return-valid? return-after-depart?)))]
    [:div
     [:h1 "Flight constraints"]
     (flight-options state channel :type)
     (date state channel :depart "Depart")
     (if return-required?
       (date state channel :return "Return"))
     (if (and return-required? depart-valid? return-valid?
              (not return-after-depart?))
       [:span.error "return before depart"])
     [:button {:disabled (not can-book?)} "Search flights"]
    ]))


;; Render it!
(let [component
  (r/mount (ui)
             (.getElementById js/document "app"))]
  (defn render [] (r/request-render component)))



;; Event Handling / Channels
(defn handle-events [{:keys [key value] :as msg}]
  (cond
   (= key :type)
   (swap! app-state assoc key value)
   (or (= key :depart) (= key :return))
   (swap! app-state assoc key
          (or (if (re-find #"\d\d\d\d.\d\d.\d\d" value)
                (to-local-date value))
              value)))
  (render))

(go (while true
  (handle-events (<! channel))))
