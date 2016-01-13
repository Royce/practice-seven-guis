(ns dev.core
  (:require
   [dev.a-counter]
   [dev.b-conversion]
   [dev.c-flight-booker]
   [dev.d-timer]
   [dev.e-crud]
   [devcards.core :as dc :refer-macros [defcard]]
   ))

(defn main []
  (dc/start-devcard-ui!))

