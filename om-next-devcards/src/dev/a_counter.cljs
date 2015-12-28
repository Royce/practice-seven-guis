(ns dev.a-counter
  (:require
   [om.next :as om :refer-macros [defui]]
   [sablono.core :refer-macros [html]]
   [devcards.core :as dc :refer-macros [defcard defcard-doc]]
   ))

(defonce state (atom {:count 0}))
(defcard state state)

(defui Counter
  static om/IQuery
  (query [this] [:count])
  Object
  (render [this]
          (let [{:keys [count]} (om/props this)]
            (html
             [:div
              [:span (str "Count: " count)] [:br]
              [:button {:on-click
                        (fn [e] (om/transact! this '[(increment)]))}
               "Increment"]]))))

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

(defcard ui
  (dc/dom-node
   (fn [_ node] (om/add-root! reconciler Counter node))))


(defcard-doc "## UI"
  (dc/mkdn-pprint-source Counter))

(defcard-doc "## Read"
  (dc/mkdn-pprint-source read))

(defcard-doc "## Mutate"
  (dc/mkdn-pprint-source mutate))
