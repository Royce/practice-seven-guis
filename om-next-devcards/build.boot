(set-env!
 :source-paths    #{"src"}
 :resource-paths  #{"resources"}
 :dependencies '[[adzerk/boot-cljs          "1.7.170-3"  :scope "test"]
                 [adzerk/boot-cljs-repl     "0.3.0"      :scope "test"]
                 [ com.cemerick/piggieback  "0.2.1"      :scope "test"]
                 [ weasel                   "0.7.0"      :scope "test"]
                 [ org.clojure/tools.nrepl  "0.2.12"     :scope "test"]
                 [adzerk/boot-reload        "0.4.2"      :scope "test"]
                 [pandeiro/boot-http        "0.7.0"      :scope "test"]
                 [devcards "0.2.1-2"]
                 [sablono  "0.5.3"]
                 [org.omcljs/om "1.0.0-alpha28"]
                 [cljsjs/react "0.14.3-0"]
                 [cljsjs/react-dom "0.14.3-1"]
                 [cljsjs/react-dom-server "0.14.3-0"]
                 [org.clojure/clojurescript "1.7.170"]])

(require
 '[adzerk.boot-cljs      :refer [cljs]]
 '[adzerk.boot-cljs-repl :refer [cljs-repl start-repl]]
 '[adzerk.boot-reload    :refer [reload]]
 '[pandeiro.boot-http    :refer [serve]])

(deftask build []
  (comp (speak)
        (cljs)
        ))

(deftask run []
  (comp (serve)
        (watch)
        (cljs-repl)
        (reload)
        (build)))

(deftask production []
  (task-options! cljs {:optimizations :advanced})
  identity)

(deftask development []
  (task-options! cljs {:optimizations :none
                       :source-map true
                       :devcards true
                       :ids #{"js/devcards"}}
                 ;reload {:on-jsload 'ns/init}
                 )
  identity)

(deftask dev
  "Simple alias to run application in development mode"
  []
  (comp (development)
        (run)))


