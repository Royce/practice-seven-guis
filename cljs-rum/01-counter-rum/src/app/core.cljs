(ns ^:figwheel-always app.core
  (:require [rum :as r]))

(enable-console-print!)
(defn on-js-reload [])


;; state
(defonce counter (atom 0))

;; View
(r/defc ui < r/reactive []
  [:div
   [:h1 "Counter"]
   [:input {:value (r/react counter)}]
   [:button {:on-click #(swap! counter inc)}
    "Increment"]])

;; Render it!
(r/mount (ui) (.getElementById js/document "app"))
