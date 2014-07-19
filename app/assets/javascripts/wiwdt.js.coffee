'use strict'
model =
  itemsTodo: [{text: "An item that is not completed"},{text: "another item that is not done"}]
  itemsDone: [{text: "An item that is done."}, {text: "Another item that is done."}]

window.todoController = ($scope) -> $scope.items = model.itemsTodo
window.doneController = ($scope) -> 
  $scope.items = model.itemsDone
  $scope.cancelDoneHandler = () ->
    $scope.$apply ()-> 
      model.itemsDone = (x for x in model.itemsDone when x.text != this.item.text)
  
setTimeout ()->model.itemsDone.push {text: "item added after a while"},
5000

  
