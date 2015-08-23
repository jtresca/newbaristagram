'use strict';

angular.module('baristagramApp')
  .controller('MainCtrl', function ($scope, $http, $cookies, $interval, $location, $route) {
    $scope.user = "";
    $scope.betaUser = false;

    $scope.logIn = function(user) {
        $scope.intialLoader = true;
        $scope.user = user.toLowerCase();
        var betaList = ['etorres', 'cmarkwich', 'jtresca', 'dobrien', 'jparker', 'barista']; 
        var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
        $scope.user = (__indexOf.call(betaList, $scope.user) >= 0) ? $scope.user : "";

        var baristaList = ['etorres', 'cmarkwich', 'jtresca', 'dobrien', 'jparker', 'barista']; 
        var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };
        $scope.admin = (__indexOf.call(baristaList, $scope.user) >= 0) ? true : false;

        if (!$scope.user) {
            $scope.betaUser = false;
        }
        else {
            $scope.betaUser = true;


    // if (!$cookies.glgSAM) {
    //     $location.path('/failed');
    // } else {

    /*==========  Globals  ==========*/
    // $scope.user = $cookies.glgSAM;
    $scope.isQueued = ""; 
    $scope.wasCanceled = false;
    $scope.navActive = 'menu'; 
    $scope.validateDrink = "";
    $scope.validateSize = "";
    $scope.validateQueue = "";
    $scope.validateStore = "";
    $scope.vip = "";
    $scope.storeOpen;
    $scope.tempdrinkname;
    $scope.showOrder = false;
    $scope.selecteddrink={};
    // $scope.orderform = {};

    /*=====================================
    =            HTTP Requests            =
    =====================================*/
    $scope.getUserOrders = function(){
        console.log("Was this canceled?: ",$scope.wasCanceled)
        $http.get('/api/userOrders/'+ $scope.user).success(function(userOrders) {
            $scope.userOrders = userOrders;
            $scope.existingOrder();
            $scope.checkifCompletedOrder(userOrders);
            $scope.intialLoader = false;


            if ($scope.userOrders[$scope.userOrders.length-1].status == "canceled") {
                 $scope.wasCanceled = true;
                 console.log("last was canceled!", $scope.wasCanceled );
                 userOrders.status = "canceled";
            }
        });
    }

    $scope.getQueuedOrders = function(){
        $http.get('/api/queuedAllUserOrders').success(function(queuedAllUserOrders) {
          $scope.queuedAllUserOrders = queuedAllUserOrders;
          $scope.peopleAhead(queuedAllUserOrders);
          $scope.waitTime();
          console.log(queuedAllUserOrders.length);
        });
    }

    $scope.getStoreStatus = function(){ 
        $http.get('/api/getStoreStatus').success(function(storeStatus) {
        $scope.storeStatus = storeStatus;
        var currentStatus = storeStatus[0].status;

        if (currentStatus == "closed") {
            $scope.storeOpen = false;
        } 
        else {
            $scope.storeOpen = true;
        }
        console.log($scope.storeOpen)
        });
    }

    $scope.getUserOrders();
    $scope.getQueuedOrders();
    $scope.getStoreStatus();

    
    /*-----  End of HTTP Requests  ------*/
    
    
    /*=======================================================
    =            Temp Drink Options - move to db            =
    =======================================================*/
    
    $scope.drinkOptions = [
        {
            "name": "espresso",
            "description": "espresso is made by forcing very hot water under high pressure through finely ground, compacted coffee, a 'double' is standard",
            "size": ["single", "double", "triple", "quad"]
        },
        {
            "name": "cappuccino",
            "description": "cappuccino is an italian coffee drink which is traditionally prepared with espresso, hot milk, and steamed-milk foam",
            "milk": ["whole", "skim", "soy", "almond"],
            "shot": ["yes", "no"]
        },
        {
            "name": "macchiato",
            "description": "macchiato is an espresso coffee drink with a small amount of milk added, today usually foamed milk",
            "milk": ["whole", "skim", "soy", "almond"],
            "shot": ["yes", "no"]
        },
        {
            "name": "americano",
            "description": "americano is a style of coffee prepared by adding hot water to espresso, giving it a similar strength to, but different flavor from, regular drip coffee",
            "milk": ["whole", "skim", "soy", "almond", "none"],
            "shot":  ["yes", "no"]
        },
        {
            "name": "iced americano",
            "description": "iced americano is a style of coffee prepared by adding hot water to espresso, giving it a similar strength to, but different flavor from, regular drip coffee",
            "milk": ["whole", "skim", "soy", "almond", "none"],
            "shot": ["yes", "no"]
        },
        {
            "name": "latte",
            "description": "latte is a coffee drink made with espresso and steamed milk",
            "milk": ["whole", "skim", "soy", "almond"],
            "foam": ["yes", "no"],
            "shot": ["yes", "no"]
        },
        {
            "name": "mocha latte",
            "description": "mocha latte is a coffee drink made with espresso and steamed milk",
            "milk": ["whole", "skim", "soy", "almond"],
            "foam": ["yes", "no"],
            "shot": ["yes", "no"]
        },
        {
            "name": "iced latte",
            "description": "iced latte contains cold milk and freshly pulled espresso to create a delicious symphony, poured over ice",
            "milk": ["whole", "skim", "soy", "almond"],
            "shot": ["yes", "no"]
        },
        {
            "name": "iced mocha latte",
            "description": "iced mocha latte contains cold milk and freshly pulled espresso to create a delicious symphony, poured over ice",
            "milk": ["whole", "skim", "soy", "almond"],
            "shot": ["yes", "no"]
        }
    ];

    
    /*-----  End of Temp Drink Options - move to db  ------*/
    
    
    /*=========================================
    =            Utility functions            =
    =========================================*/
    $scope.checkifCompletedOrder = function(userOrders) {
        var recentOrders = _.filter(userOrders, function(order){ 
            if (userOrders.length > 0 || order.endTime != undefined) {
                return (moment(order.endTime).add('minutes', 10)) > moment();
            }
        });

        if (recentOrders.length > 0 && $scope.isBrewing == "" && $scope.isQueued == "") {
            $scope.recentCompletion = true;
            var snd = new Audio('sounds/completedrink.mp3');
            snd.play();
            console.log(recentOrders)
        }
        else {
            $scope.recentCompletion = false;
        } 
    }

    $scope.vipCustomer = function() {
        var vipList = ['saintale', 'lshannon', 'etorres']; 
        var user = $scope.user.toLowerCase();  
        var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

        $scope.vipUser = (__indexOf.call(vipList, user) >= 0) ? true : false;
    };
    $scope.vipCustomer();


    $scope.update = function(user) {
      $scope.master = angular.copy(user);
    };

    $scope.master = {};
  $scope.reset = function() {
    console.log("RESET ACTIVATE!", $scope.selecteddrink);
    $scope.orderform = '';
      delete $scope.validateDrink;
      delete $scope.validateSize;
      delete $scope.validateFoam;
      delete $scope.validateMilk;
      delete $scope.validateShot;
      $scope.fieldSize = false;
        $scope.fieldFoam = false;
        $scope.fieldMilk = false;
        $scope.fieldShot = false;
        $scope.orderform = {};
      $scope.selecteddrink = $scope.drinkOptions[0];
      $scope.showOrder = false;
      $scope.buildDrink();
  };

  
   
$scope.buildDrink = function(newdata) {
    console.log("NEWDATA: ", newdata);
   $scope.tempdrinkname = newdata;
    $scope.fieldSize = false;
        $scope.fieldFoam = false;
        $scope.fieldMilk = false;
        $scope.fieldShot = false;
        $scope.showOrder = false;

        if (newdata == "espresso"){
            $scope.showOrder = true;
           $scope.fieldSize = true;
          }
        else if (newdata == "cappuccino") {
            $scope.showOrder = true;
           $scope.fieldMilk = true;
           $scope.fieldShot = true;
        }
        else if (newdata == "macchiato") {
            $scope.showOrder = true;
           $scope.fieldMilk = true;
           $scope.fieldShot = true;
        }
        else if (newdata == "americano") {
            $scope.showOrder = true;
           $scope.fieldMilk = true;
           $scope.fieldShot = true;
        }
        else if (newdata == "iced americano") {
            $scope.showOrder = true;
           $scope.fieldMilk = true;
           $scope.fieldShot = true;
        }
        else if (newdata == "latte") {
            $scope.showOrder = true;
           $scope.fieldFoam = true;
           $scope.fieldMilk = true;
           $scope.fieldShot = true;
        }
        else if (newdata == "mocha latte") {
            $scope.showOrder = true;
           $scope.fieldFoam = true;
           $scope.fieldMilk = true;
           $scope.fieldShot = true;
        }
        else if (newdata == "iced latte") {
            $scope.showOrder = true;
           $scope.fieldMilk = true;
           $scope.fieldShot = true;
        }
        else if (newdata == "iced mocha latte") {
            $scope.showOrder = true;
           $scope.fieldIce = true;
           $scope.fieldMilk = true;
           $scope.fieldShot = true;
        }
        else {

        }
}



    $scope.newOrder = function(drink, orderform) {
      console.log("triggered", drink);
        $scope.validateDrink = false;
        $scope.validateSize = false;
        $scope.validateFoam = false;
        $scope.validateMilk= false;
        $scope.validateShot = false;
        $scope.validateQueue = false;
        orderform.drink = drink;
        orderform.customer = $scope.user;
        orderform.vip = $scope.vipUser;
        $scope.existingOrder();

        if (!drink || drink == null) {
            $scope.validateDrink = true;
        }
        if (!orderform.size && $scope.tempdrinkname == "espresso") {
            $scope.validateSize = true;
        }
        if (!orderform.milk && $scope.tempdrinkname != "espresso") {
            $scope.validateMilk = true;
        }
        if (!orderform.shot && $scope.tempdrinkname != "espresso") {
            $scope.validateShot = true;
        }
        if (!orderform.foam && ($scope.tempdrinkname == "latte" || $scope.tempdrinkname == "mocha latte")) {
            $scope.validateFoam = true;
        }
        if (($scope.isQueued != "") || ($scope.isBrewing != "") ) {
            $scope.validateQueue = true;
        }
        else if (!$scope.validateDrink && !$scope.validateSize && !$scope.validateFoam && !$scope.validateMilk && !$scope.validateShot ) {
            $scope.loader = true;
            $http.post("api/newOrder", orderform)
            .success(function(data, status, headers, config) {
                $scope.loader = false;
                $scope.userOrders.push(data);
                $scope.navActive = 'orders';
                $scope.existingOrder();
                $scope.peopleAhead($scope.queuedAllUserOrders);
            }).error(function(data, status, headers, config) {
                 console.log("error");
            });    
        }

    };

    // fix this reorder variable to remove fields rather than build them
    $scope.reOrder = function(order) {
        var reorder = {
            "drink" : order.drink,
            "size" : order.size,
            "foam" : order.foam,
            "milk" : order.milk,
            "shot" : order.shot,
            "customer" : $scope.user,
            "vip" : $scope.vipUser
        }

            $scope.loader = true;
            $http.post("api/newOrder", reorder)
            .success(function(data, status, headers, config) {
                $scope.loader = false;
                $scope.userOrders.push(data);
                $scope.navActive = 'orders';
                $scope.existingOrder();
                $scope.peopleAhead($scope.queuedAllUserOrders);
            }).error(function(data, status, headers, config) {
                 console.log("error");
            });  
    };

    $scope.updateStatus = function(orderId) {
        var orderUpdates = {
            status: "canceled"
        }

        if (confirm('But you created such a tastey drink. Are you sure?')) {
          $http.post('/api/updateOrder/' + orderId, orderUpdates).success(function(data) {
                $scope.getUserOrders();
                console.log(data);
                console.log("DELETED");
            }).error(function(data, status, headers, config) {
                 console.log("error");
            }); 
        } else {
            return;
        }
    };

    $scope.$watch("selecteddrink", function (newdata,olddata){
        if (newdata != olddata){
            delete $scope.validateDrink;
            $scope.orderform = {};
          }
    });

    $scope.navSelect = function(selection) {
        $scope.navActive = selection;
    }

    $scope.existingOrder = function() {
        var checkQueued = _.where($scope.userOrders, {status: "queued"});
        var checkBrewing = _.where($scope.userOrders, {status: "brewing"});
            $scope.isQueued = checkQueued.length > 0 ? checkQueued[0].date : false;
            $scope.isBrewing = checkBrewing.length > 0 ? checkBrewing[0].date : false;
    }

    $scope.peopleAhead = function(queuedAllUserOrders) {
        var inFront = _.filter(queuedAllUserOrders, function(order){ 
            return moment(order.date) < moment($scope.isQueued);
        });
        $scope.inFront = inFront.length;
    }

    $scope.waitTime = function() {
    
        $scope.pickupTime = moment().add('minutes',(($scope.inFront*5)+5)).format('h:mm a');
    }

    $scope.compareOldNewData = function() {
        $http.get('/api/userOrders/'+ $scope.user).success(function(userOrders) {
            var newData = userOrders;
            var oldData = $scope.userOrders;
                oldData = angular.toJson(oldData);
                newData = angular.toJson(newData);

              if  (newData != oldData) {
                    $scope.getUserOrders();
              }
        });
        $http.get('/api/queuedAllUserOrders').success(function(queuedAllUserOrders) {
            var newData = queuedAllUserOrders;
            var oldData = $scope.queuedAllUserOrders;
                oldData = angular.toJson(oldData);
                newData = angular.toJson(newData);

              if  (newData != oldData) {
                    $scope.getQueuedOrders();
                    console.log("queuedAllUserOrders");
              }
        });
        $http.get('/api/getStoreStatus').success(function(storeStatus) {
            var newData = storeStatus;
            var oldData = $scope.storeStatus;
                oldData = angular.toJson(oldData);
                newData = angular.toJson(newData);

              if  (newData != oldData) {
                    $scope.getStoreStatus();
                    console.log("getStoreStatus");
              }
        });
    }
    $interval($scope.compareOldNewData, 10000);
    /*-----  End of Utility functions  ------*/
        }
    }
  });
