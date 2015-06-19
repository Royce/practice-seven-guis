(ns ^:figwheel-always counter-quiescent.core
  (:require-macros [cljs.core.async.macros :refer [go]])
  (:require [cljs.core.async :refer [chan <! >!]]
            [quiescent.core :as q]
            [quiescent.dom :as d]))

(enable-console-print!)
;; Figwheel plumbing
(defn on-js-reload [])


;; Data
(def channel (chan))
(defonce app-state (atom {:count 0}))


;; View

(q/defcomponent Counter [data]
  (d/div {:className "articles"}
    (d/h1 nil "Counter")
    (d/input {:type "text"
              :value (:count data)
              :readOnly true})
    (d/button
      {:onClick (fn [_] (go (>! channel :increment)))}
      "Increment")))


;; Render it!
(defn render [data]
  (q/render (Counter data)
            (.getElementById js/document "app")))

(render @app-state)


;; Event Handling / Channels
(defn handle-events [msg]
  (case msg
    :increment (swap! app-state update-in [:count] inc))
  (render @app-state))

(go (while true
  (handle-events (<! channel))))
