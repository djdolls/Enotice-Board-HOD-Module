'use strict';
angular.module('EnoticeBoardWebApp.dashboard', ['ngRoute']).config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/dashboard', {
        templateUrl: 'dashboard/dashboard.html'
        , controller: 'dashboardCtrl'
    });
}]).controller('dashboardCtrl', ['$scope', 'CommonProp', '$firebaseArray', '$firebaseObject', '$firebaseAuth', '$location', function ($scope, CommonProp, $firebaseArray, $firebaseObject, $firebaseAuth, $location) {
    $scope.username = CommonProp.getUser();
    var Department;
    var name;
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var userId = firebase.auth().currentUser.uid;
            var reff = firebase.database().ref('/Users/' + userId).once('value').then(function (snapshot) {
                Department = snapshot.val().department;
                name = snapshot.val().name;
                $scope.depth = Department; //Department
                console.log(Department);
                $scope.name = name; //username
                var Level = snapshot.val().level;
                if (Level == 2 || Level == 3) {
                    var ref = firebase.database().ref().child('posts').child(Department).child('Approved').orderByChild("servertime");
                    $scope.articles = $firebaseArray(ref);
                    var ref1 = firebase.database().ref().child('posts').child(Department).child('Pending').orderByChild("approved").equalTo("pending");
                    $scope.pending = $firebaseArray(ref1);
                    var ref11 = firebase.database().ref().child('posts').child(Department).child('Pending').orderByChild("approved").equalTo("pending").limitToLast(5);
                    $scope.notify = $firebaseArray(ref11);
                    var ref2 = firebase.database().ref().child('Users').orderByChild("department").equalTo(Department);
                    $scope.users = $firebaseArray(ref2);
                    console.log($scope.pending);
                    var principal = firebase.database().ref().child('posts').child('ALL').child('Approved').orderByChild("servertime");
                    $scope.principal1 = $firebaseArray(principal);
                }
                else{
                    alert("Not allowed to use this module");
                }
            });
        }
        else {
            alert("please sign in");
        }
    });
    $scope.editPost = function (id) {
        var ref = firebase.database().ref().child('posts').child(Department).child('Deptposts').child(id);
        $scope.editPostData = "true";
        console.log($scope.editPostData);
        ref.update({}).then(function (ref) {
            console.log(ref);
        }, function (error) {
            console.log(error);
        });
    };
    $scope.logout = function () {
        console.log("DJDJDJJDJ");
        CommonProp.logoutUser();
    }
    $scope.deleteCnf = function (user) {
        $scope.deleteArticle = user;
        console.log($scope.deleteArticle.username);
    };
    $scope.viewCnf = function (user) {
        $scope.viewArticles = user;
        console.log($scope.viewArticles);
    };
    $scope.deletepost = function (deleteArticle) {
        $scope.articles.$remove(deleteArticle);
        $("#deleteModal").modal('hide');
    };
  }])