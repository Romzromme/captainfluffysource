angular
    .module('game.ui.main-menu.create-char', [
        'angular-meteor',
        'engine.game-service',
        'engine.char-builder',
        'engine.util',
        'engine.ib-constants',
        'game.ui.dialog',
        'underscore',
        'ui.router'
    ])
    .config(['$stateProvider', function($stateProvider) {
        'use strict';

        $stateProvider.state('main-menu.create-char', {
            templateUrl: 'client/game/ui/main-menu/create-char/create-char.ng.html',
            controller: ['$scope', '$state', 'GameService', 'CharBuilder', 'Util', '_', 'IbConstants', '$meteor', 'dialogService', '$log',
                function($scope, $state, GameService, CharBuilder, Util, _, IbConstants, $meteor, dialogService, $log) {

                    $scope.back = function() {
                        $state.go('main-menu.enter-world');
                    };

                    $scope.makeChar = function() {
                        var gender = $scope.boy ? 'male' : 'female';
                        var options = {
                            charName: $scope.charName,
                            boy: $scope.boy,
                            skin: IbConstants.characterParts[gender].skin[$scope.skinIndex],
                            eyes: IbConstants.characterParts[gender].eyes[$scope.eyesIndex],
                            hair: IbConstants.characterParts[gender].hair[$scope.hairIndex],
                        };

                        $meteor.call('createChar', options)
                            .then(function(result) {
                                $log.debug('createChar result: ', result);
                                $state.go('main-menu.enter-world');
                            }, function(err) {
                                if (err) {
                                    dialogService.alert(err.reason);
                                }
                            });
                    };

                    // Character creation
                    var updateCharacterPreview = function() {
                        var gender = $scope.boy ? 'male' : 'female';

                        // Make sure the attributes are correct
                        if ($scope.skinIndex >= IbConstants.characterParts[gender].skin.length) {
                            $scope.skinIndex = 0;
                        } else if ($scope.skinIndex < 0) {
                            $scope.skinIndex = IbConstants.characterParts[gender].skin.length - 1;
                        }

                        if ($scope.eyesIndex >= IbConstants.characterParts[gender].eyes.length) {
                            $scope.eyesIndex = 0;
                        } else if ($scope.eyesIndex < 0) {
                            $scope.eyesIndex = IbConstants.characterParts[gender].eyes.length - 1;
                        }

                        if ($scope.hairIndex >= IbConstants.characterParts[gender].hair.length) {
                            $scope.hairIndex = 0;
                        } else if ($scope.hairIndex < 0) {
                            $scope.hairIndex = IbConstants.characterParts[gender].hair.length - 1;
                        }

                        CharBuilder.makeChar({
                            skin: IbConstants.characterParts[gender].skin[$scope.skinIndex],
                            eyes: IbConstants.characterParts[gender].eyes[$scope.eyesIndex],
                            hair: IbConstants.characterParts[gender].hair[$scope.hairIndex],
                        }).then(function(url) {
                            $scope.charPrevImg = url;
                        });
                    };

                    $scope.boy = Util.getRandomInt(0, 1) ? true : false;
                    var gender = $scope.boy ? 'male' : 'female';
                    $scope.skinIndex = Util.getRandomInt(0, IbConstants.characterParts[gender].skin.length - 1);
                    $scope.eyesIndex = Util.getRandomInt(0, IbConstants.characterParts[gender].eyes.length - 1);
                    $scope.hairIndex = Util.getRandomInt(0, IbConstants.characterParts[gender].hair.length - 1);

                    $scope.nextSkin = function() {
                        $scope.skinIndex++;
                        updateCharacterPreview();
                    };

                    $scope.prevSkin = function() {
                        $scope.skinIndex--;
                        updateCharacterPreview();
                    };

                    $scope.nextEyes = function() {
                        $scope.eyesIndex++;
                        updateCharacterPreview();
                    };

                    $scope.prevEyes = function() {
                        $scope.eyesIndex--;
                        updateCharacterPreview();
                    };

                    $scope.nextHair = function() {
                        $scope.hairIndex++;
                        updateCharacterPreview();
                    };

                    $scope.prevHair = function() {
                        $scope.hairIndex--;
                        updateCharacterPreview();
                    };

                    updateCharacterPreview();

                    $scope.toggleGender = function() {
                        $scope.boy = !$scope.boy;
                        updateCharacterPreview();
                    };

                    $scope.charParts = IbConstants.characterParts;

                }
            ]
        });
    }]);