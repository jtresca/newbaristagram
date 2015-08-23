'use strict';

angular.module('baristagramApp')
  .controller('AdminCtrl', function ($scope, $http, $cookies, $interval, $location) {
    
    // if (!$cookies.glgSAM) {
    //     $location.path('/failed');
    // } else {


    $scope.queuedAllUserOrders;
    $scope.noUsersMessageToggle = 'showMessage';

    $scope.showHistory = false;
    $scope.historyLabel = "past orders"
    $scope.vipCounter;
    // $scope.user = $cookies.glgSAM;
    $scope.user = "barista";
    $scope.totalCurrentOrders;
    $scope.store;
    $scope.minutesElapsed = 0;
    $scope.secondsElapsed = 0;

    $scope.myTotalSeconds = 0;
    $scope.myTotalMinutes = 0;

    $scope.averageSeconds = 0;
    $scope.averageMinutes = 0;

    $scope.queuedTotalHours = 0;
    $scope.queuedTotalMinutes = 0;


    $scope.secondDrinkTimeArray = [];
    $scope.minuteDrinkTimeArray = [];

    $http.get('/api/getStoreStatus').success(function(storeStatus) {
        $scope.store = storeStatus[0].status;
    });

    $http.get('/api/allUserHistory').success(function(allUserHistory) {
        $scope.allUserHistory = allUserHistory;
    });

    $scope.showHistoryBtn = function() {
        if ($scope.showHistory == false) {
            $scope.showHistory = true;
            $scope.historyLabel = "live orders"
            $scope.noUsersMessageToggle = 'showMessage';
            
        }
        else if ($scope.showHistory == true) {
            $scope.showHistory = false;
            $scope.historyLabel = "past orders"
                    }
        if ($scope.queuedAllUserOrders == '') {
            console.log("no user orders!!!!");
            $scope.noUsersMessageToggle = 'hideMessage';


        }
    }

    $scope.compareOldNewData = function() {
        $http.get('/api/queuedAllUserOrders').success(function(allOfTheOrders) {
            var newData = allOfTheOrders;
            var oldData = $scope.queuedAllUserOrders
                oldData = angular.toJson(oldData);
                newData = angular.toJson(newData);

              if  (newData != oldData) {
                    $scope.adminQueue(); 
              }
            });
    }
    $interval($scope.compareOldNewData, 7000);

    $scope.$watch("totalCurrentOrders", function (newdata,olddata){
        if (newdata > olddata) {
            var snd = new Audio('sounds/bell.mp3');
            snd.play();
        }
    });

    $scope.adminQueue = function() {
        var baristaList = ['etorres', 'cmarkwich', 'jtresca', 'dobrien', 'jparker', 'barista']; 
        var user = $scope.user;
        console.log($scope.user)
        var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
        $scope.admin = (__indexOf.call(baristaList, user) >= 0) ? true : false;

        if ($scope.admin) {
            $http.get('/api/queuedAllUserOrders').success(function(queuedAllUserOrders) {
              $scope.queuedAllUserOrders = queuedAllUserOrders;
              $scope.admin = true;
              $scope.totalCurrentOrders = queuedAllUserOrders.length;
              $scope.totalVipOrders = (_.where($scope.queuedAllUserOrders, {vip: "true"})).length;

            
                if ($scope.totalVipOrders > 0) {
                    $scope.vipCounter = true;
                } 

            });
        }
        else {
            $location.path('/');
        }
    };
    $scope.adminQueue();

    $scope.updateStatus = function(orderId, orderStatus) {
        var currentTime = Date.now();

        if (orderStatus == "cancel") {
            orderStatus = "canceled";
            var orderUpdates = {
                status : orderStatus
            };   
        } else if (orderStatus == "queued") {
            orderStatus = "brewing";
            var orderUpdates = {
                status : orderStatus,
                startTime: currentTime
            };
        } else if (orderStatus == "brewing") {
            orderStatus = "completed";
            var orderUpdates = {
                status : orderStatus,
                endTime: currentTime
            };
        } else {
            return;
        }
        console.log(orderUpdates)
        $scope.loader = true;
        $http.post('/api/updateOrder/' + orderId, orderUpdates).success(function(data) {
                console.log(data, "UPDATE LOOKS LIKE THIS")
                $scope.adminQueue();
                $scope.stopDrink();
                $scope.refreshSliding();
        });
    }

    $scope.changeStoreStatus = function() {
        if ($scope.store == "closed") {
            $scope.store = "opened";
        } 
    else {
            $scope.store = "closed";
        }
        var storeStatus = {
            "status" : $scope.store
        }
        console.log(storeStatus)

        $http.post("api/setStoreStatus", storeStatus)
        .success(function(data, status, headers, config) {
            console.log("success")
            console.log(data, status)
            $scope.store = data.status;
        }).error(function(data, status, headers, config) {
             console.log("error");
        });    
    }

    // controls sliding of rows for barista to complete order

    $scope.refreshSliding = function () {

        var makeDraggable = function(){
                _.each($scope.queuedAllUserOrders, function(order){
                    if (order.status == 'brewing'){
                        var rowname = document.getElementById("rowname"+order._id);
                        Draggable.create(rowname, {snap:
                        {x:["-100", 0]},type:"x", throwProps:true, bounds:{top:0, left:0, width: rowname.offsetWidth - 100}});
                    }
                });

            }

        $interval(function() {  
                console.log("interval run!");
                    makeDraggable();

                window.onresize = function() {
                    makeDraggable();
                }
            }, 1000,1);
        }

    $scope.refreshSliding();

    // Timer for orders
    $scope.getQueuedTotals = function() {
       $scope.queuedTotalHours = Math.round(($scope.averageMinutes * $scope.totalCurrentOrders) / 60);
       $scope.queuedTotalMinutes = Math.round(($scope.averageSeconds * $scope.totalCurrentOrders) / 60);
       console.log($scope.queuedTotalHours, "is total QUEUED HOURS");
       console.log($scope.queuedTotalMinutes, "is total QUEUED Minutes");
    };

    $scope.getAverageDrinkTime = function() {
        if ($scope.secondDrinkTimeArray.length >= 6) {
            $scope.secondDrinkTimeArray.pop();
            $scope.calcSecondArraySum();  
        }
        else {
            $scope.secondDrinkTimeArray.unshift($scope.secondsElapsed);
        }
        console.log($scope.secondDrinkTimeArray, ":seconds array");

    
        if ($scope.minuteDrinkTimeArray.length >= 6) {
            $scope.minuteDrinkTimeArray.pop();
            $scope.calcMinuteArraySum(); 
        }
        else {
            $scope.minuteDrinkTimeArray.unshift($scope.minutesElapsed);
        }
        console.log($scope.minuteDrinkTimeArray, ":minutes array");

    };

    $scope.calcSecondArraySum = function() {
         console.log("calcSecondArraySum is FIRED!")
            $scope.myTotalSeconds= 0;
            for(var i = 0; i < $scope.secondDrinkTimeArray.length; i++){
                $scope.myTotalSeconds += $scope.secondDrinkTimeArray[i];
            }
            $scope.averageSeconds = Math.round(($scope.myTotalSeconds / $scope.secondDrinkTimeArray.length));
            console.log($scope.averageSeconds, 'average seconds');
            $scope.getQueuedTotals();
    };

    $scope.calcMinuteArraySum = function() {
         console.log('calcMinuteArraySum is FIRED!')
            $scope.myTotalMinutes= 0;
            for(var i = 0; i < $scope.minuteDrinkTimeArray.length; i++){
                $scope.myTotalMinutes += $scope.minuteDrinkTimeArray[i];
            }
            $scope.averageMinutes = Math.round(($scope.myTotalMinutes / $scope.minuteDrinkTimeArray.length));
            console.log($scope.averageMinutes, 'average minutes');
    };

    $scope.startDrink = function() {
        console.log("START");
        $scope.resetLastDrinkTime();
        $scope.drinkStartTimeSec = moment();
    };

     $scope.stopDrink = function() {
        console.log("STOP");
        $scope.drinkStoppedTimeSec = moment();
        $scope.getLastDrinkTime();
        $scope.getAverageDrinkTime();
    };

    $scope.getLastDrinkTime = function() {
        console.log("FIRED");
        $scope.minutesElapsed = $scope.drinkStoppedTimeSec.diff($scope.drinkStartTimeSec, 'minutes')
        $scope.ms = $scope.drinkStoppedTimeSec.diff($scope.drinkStartTimeSec, 'milliseconds');
        $scope.secondsElapsed = Math.floor(moment.duration($scope.ms).seconds());  
    };

     $scope.resetLastDrinkTime = function() {
       $scope.minutesElapsed = 0;
       $scope.secondsElapsed = 0;
    };
    // ends timer for orders
    

    
});


