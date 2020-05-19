(ns dev.e-crud
  (:require
   [om.next :as om :refer-macros [defui]]
   [sablono.core :refer-macros [html]]
   [devcards.core :as dc :refer-macros [defcard defcard-doc]]
   ))

(enable-console-print!)

(defonce state (atom {:list #{{:first-name "Thom" :last-name "Torke"}
                              {:first-name "Robbie" :last-name "Willie"}}
                      :new {:first-name "Robert" :last-name "Paulson"}
                      :selected #{}
                      :prefix ""}))
(defcard state state)

(defui Person
  static om/IQuery
  (query [this] [:first-name :last-name])
  Object
  (render [this]
          (let [{:keys [first-name last-name]} (om/props this)
                {:keys [update]} (om/get-computed this)]
            (html
             [:div
              [:div [:label {:for "fn"} "Name: "]
               [:input {:id "fn"
                        :on-change (partial update :first-name)
                        :value first-name}]]
              [:div [:label {:for "ln"} "Surname: "]
               [:input {:id "ln"
                        :on-change (partial update :last-name)
                        :value last-name}]]]))))
(def person (om/factory Person))
(def person-props (zipmap (om/get-query Person) (repeat nil)))
;; (defcard Person (person {:first-name "Bill" :last-name "Mayer"}))

(defn event->selected [e]
  (->> (array-seq (.. e -target -options) 0)
       (filter #(= true (.-selected %)))
       (map #(.-value %))
       ))

(defui Manager
  static om/IQuery
  (query [this]
         `[:prefix :selected {:list ~(om/get-query Person)} {:new ~(om/get-query Person)}])
  Object
  (render [this]
          (let [{:keys [list new prefix selected]} (om/props this)]
            (html
             [:div {:style {:display "flex" :flex-direction "row"}}
              [:div
               [:div
                [:label {:for "prefix"} "Filter prefix: "]
                [:input
                 {:id "prefix"
                  :value prefix}]]
               (let [list (zipmap (map str (range)) list)
                     selected (into [] (map (partial get (clojure.set/map-invert list)) selected))]
                 [:select {:style {:width "100%"}
                           :multiple true
                           :value selected
                           :on-change
                           (fn [e]
                             (let [items (into #{} (map list (event->selected e)))]
                               (om/transact! this `[(list/select {:items ~items})])))}
                  (map
                   (fn [[i {:keys [first-name last-name]}]]
                     [:option {:value i} (str last-name ", " first-name)])
                   list)])
               [:div
                (if (< 0 (count selected))
                  [:button
                   {:on-click (fn [_] (om/transact! this `[(list/delete)]))}
                   "Delete"])
                (if (= 1 (count selected))
                  [:button "Update"])
                [:button
                 {:on-click (fn [_] (om/transact! this `[(list/append)]))}
                 "New"]
                ]]
              (person
               (om/computed
                new
                {:update
                 (fn [key event]
                   (let [value (.. event -target -value)]
                     (om/transact! this `[(edit/update {:ks [:new ~key] :v ~value})])))}))
              ]))))
;;(defcard root-query (om/get-query Manager))

(defn read [{:keys [state] :as env} key params]
      (let [st @state]
        (if-let [[_ value] (find st key)]
          {:value value}
          {:value :not-found})))

(defmulti mutate om/dispatch)

(defmethod mutate 'list/select
  [{:keys [state] :as env} _key {:keys [items] :as params}]
  {:value {:keys [:selected :new]}
   :action (fn []
             (swap! state assoc :selected items)
             (case (count items)
               0 nil
               1 (swap! state assoc :new (first items))
               (swap! state assoc :new person-props)
               ))})

(defmethod mutate 'list/append
  [{:keys [state] :as env} _key _params]
  {:value {:keys [:list]}
   :action (fn []
             (swap! state update :list conj (@state :new))
             (swap! state assoc :new person-props)
             )})

(defmethod mutate 'list/delete
  [{:keys [state] :as env} _key _params]
  {:value {:keys [:list :selected]}
   :action (fn []
             (swap! state update :list clojure.set/difference (@state :selected))
             (swap! state assoc :selected [])
             )})

(defmethod mutate 'edit/update
  [{:keys [state] :as env} _key {:keys [ks v]}]
  {:action (fn [] (swap! state assoc-in ks v))})

;; (defcard ((om/parser {:read read})
;;           {:state state}
;;           (om/get-query Manager)))

(def reconciler
  (om/reconciler
   {:state state
    :parser (om/parser {:read read :mutate mutate})}))

(defcard ui
  (dc/dom-node
   (fn [_ node] (om/add-root! reconciler Manager node))))

;;(defcard-doc "## UI"
;;  (dc/mkdn-pprint-source Thing))

