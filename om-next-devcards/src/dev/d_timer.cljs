(ns dev.d-timer
  (:require [clojure.set :as set]
            [devcards.core :as dc :refer-macros [defcard defcard-doc]]
            [om.next :as om :refer-macros [defui]]
            [sablono.core :refer-macros [html]]
            [cljs.reader :refer [read-string]]))

(def min-duration (* 1 1000))
(def max-duration (* 30 1000))
(defonce state (atom {:elapsed-time 0 :duration 20000}))
(defcard state state)

(defn now [] (.getTime (js/Date.)))
(defn start [state] (assoc state :prev-tick (now)))
(defn stop  [state] (assoc state :prev-tick nil))
(defn reset [state] (assoc state :elapsed-time 0))

(defn tick [{:keys [prev-tick elapsed-time duration] :as state}]
  (let [next-tick (now)]
    (cond
      (and (not (nil? prev-tick)) (< elapsed-time duration))
      (merge state
             {:elapsed-time (+ elapsed-time (- next-tick prev-tick))
              :prev-tick next-tick})
      (> elapsed-time duration)
      (stop state)
      (and (nil? prev-tick) (< elapsed-time duration))
      (start state)
      ))
  )


(defui Timer
  static om/IQuery
  (query [this] [:elapsed-time :duration])
  Object
  (render [this]
          (let [{:keys [elapsed-time duration]} (om/props this)
                elapsed-portion (js/Math.min 1 (/ elapsed-time duration))
                elapsed-desc (str (js/Math.round (* 100 elapsed-portion))
                                  "%")]
            (html
             [:div
              [:div "Elapsed time: "
               [:span {:style {:display "inline-block"
                               :width 300 :height 18
                               :background-color "#eee"}}
                [:span {:style {:display "inline-block"
                                :width (* 300 elapsed-portion) :height 18
                                :background-color "#00f"
                                :color "white"}}
                 (if (< 0.1 elapsed-portion) elapsed-desc)]
                (if (> 0.1 elapsed-portion) elapsed-desc)]
               " "
               (str (/ elapsed-time 1000) "s")]
              [:div "Duration:"
               [:input
                {:type "range"
                 :value duration
                 :min min-duration :max max-duration
                 :on-change
                 (fn [e]
                   (om/transact! this `[(duration/set ~{:value (.. e -target -value)})])
                   )
                 }]]
              [:button {:on-click (fn [_] (om/transact! this `[(timer/reset)]))}
               "Reset!"]]
             ))))

(defn read [{:keys [state] :as env} key params]
      (let [st @state]
        (if-let [[_ value] (find st key)]
          {:value value}
          {:value :not-found})))

(defmulti mutate om/dispatch)

(defmethod mutate 'timer/reset
  [{:keys [state]} _key _params]
  {:action #(swap! state (comp start reset))}
  )
(defmethod mutate 'timer/update
  [{:keys [state]} _key _params]
  {:action #(swap! state tick)}
  )
(defmethod mutate 'duration/set
  [{:keys [state]} _key {:keys [value]}]
  {:action #(swap! state assoc :duration value)}
  )

(def reconciler
  (om/reconciler
   {:state state
    :parser (om/parser {:read read :mutate mutate})}))

(js/setInterval #(om/transact! reconciler `[(timer/update)]) 100)

(defcard ui
  (dc/dom-node
   (fn [_ node] (om/add-root! reconciler Timer node))))

