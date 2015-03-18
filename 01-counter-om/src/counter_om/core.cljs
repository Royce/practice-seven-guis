(ns ^:figwheel-always counter-om.core
    (:require[om.core :as om :include-macros true]
              [om.dom :as dom :include-macros true]))

(enable-console-print!)

(println "Edits to this text should show up in your developer console.")

;; define your app data so that it doesn't get over-written on reload

(defonce app-state (atom {:count 0}))

(defn inc-count [data]
  (om/transact! data :count #(inc %)))

(om/root
  (fn [data owner]
    (reify om/IRender
      (render [_]
        (dom/div nil
          (dom/h1 nil "Counter")
          (dom/input
            #js {:type "text" :ref "counter"
                 :value (:count data)})
          (dom/button
            #js {:onClick #(inc-count data)}
            "Count")))))
  app-state
  {:target (. js/document (getElementById "app"))})


