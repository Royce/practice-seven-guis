(ns dev.c-flight-booker
  (:require
   [om.next :as om :refer-macros [defui]]
   [sablono.core :refer-macros [html]]
   [devcards.core :as dc :refer-macros [defcard defcard-doc]]
   ))

(defonce state (atom {}))
(defcard TODO state)

(defui TODO
  ;;static om/IQuery
  ;;(query [this] [:count])
  Object
  (render [this]
          (let [{:keys []} (om/props this)]
            (html
             [:div
              ]))))

(defn read [{:keys [state] :as env} key params]
      (let [st @state]
        (if-let [[_ value] (find st key)]
          {:value value}
          {:value :not-found})))

(defn mutate [{:keys [state] :as env} key params]
        (if (= 'increment key)
          {:value [:count]
           :action #(swap! state update-in [:count] inc)}
          {:value :not-found}))

(def reconciler
  (om/reconciler
   {:state state
    :parser (om/parser {:read read :mutate mutate})}))

;;(defcard ui
;;  (dc/dom-node
;;   (fn [_ node] (om/add-root! reconciler Thing node))))


;;(defcard-doc "## UI"
;;  (dc/mkdn-pprint-source Thing))

