(ns dev.b-conversion
  (:require [clojure.set :as set]
            [devcards.core :as dc :refer-macros [defcard defcard-doc]]
            [om.next :as om :refer-macros [defui]]
            [sablono.core :refer-macros [html]]
            [cljs.reader :refer [read-string]]))

(defonce state (atom {:fahrenheit 32 :celsius 0}))
(defcard state state)

(defui Conversion
  static om/IQuery
  (query [this] [:fahrenheit :celsius])
  Object
  (render [this]
          (let [{:keys [fahrenheit celsius]} (om/props this)]
            (html
             [:div
              [:h2 (str celsius "°C is " fahrenheit "°F")]
              [:label
               [:input {:value fahrenheit
                        :on-change
                        (fn [e] (om/transact! this `[(set/f  ~{:new (.. e -target -value)})]))}]
               "°F"]
              " = "
              [:label
               [:input {:value celsius
                        :on-change
                        (fn [e] (om/transact! this `[(set/c  ~{:new (.. e -target -value)})]))}]
               "°C"]
              ]))))

(defn read [{:keys [state] :as env} key params]
      (let [st @state]
        (if-let [[_ value] (find st key)]
          {:value value}
          {:value :not-found})))

(defn str->int [s]
  (when (and (string? s)
             (re-find #"^\d+$" s))
    (read-string s)))

(defmulti mutate om/dispatch)

(defmethod mutate 'set/c
  [{:keys [state]} _key {:keys [new]}]
  (let [parsed (str->int new)]
    (if parsed
      {:action #(swap! state (fn [_ n] {:celsius n :fahrenheit (+ 32 (* n 1.8))}) parsed)}
      {:action #(swap! state assoc :celsius new)}
      )))

(defmethod mutate 'set/f
  [{:keys [state]} _key {:keys [new]}]
  (let [parsed (str->int new)]
    (if parsed
      {:action #(swap! state (fn [_ n] {:celsius (/ (- n 32) 1.8) :fahrenheit n}) parsed)}
      {:action #(swap! state assoc :fahrenheit new)}
      )))

(def reconciler
  (om/reconciler
   {:state state
    :parser (om/parser {:read read :mutate mutate})}))

(defcard ui
  (dc/dom-node
   (fn [_ node] (om/add-root! reconciler Conversion node))))


(defcard-doc "## UI"
  (dc/mkdn-pprint-source Conversion))
