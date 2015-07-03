var app = angular.module('defectTray', ['ui.bootstrap', 'underscore']);

app.controller('mainController', function(trayService, $modal, $log, _) {

    var self = this;
    self.trayInfo = trayService.getTrayInfo();
    self.trays = trayService.getTrays();
    self.defects = trayService.getDefects();
    self.slotActive = self.trays[0];
    self.slotActive.isActive = true;
    
    self.slotClick = function(tray) {
        move(tray.trayNo - 1);
        
        var modal = $modal.open({
          animation: true,
          backdrop: 'static',
          templateUrl: 'modal.html',
          controller: 'defectController',
          controllerAs: 'defect',
          size: 'lg',
          resolve: {
            defects: function () {
              return self.defects;
            }
          }
        });

        modal.result.then(function (defect) {
            $log.info(defect);
            if(defect == null) {
                tray.defectCode = '';
                tray.en = '';
                tray.clipNo = '';
            } else {
                tray.defectCode = defect.Code;
                tray.hasChange = true;
            }
        }, function () { 
            $log.info('Modal dismissed at: ' + new Date()); 
        });
    };
    
    // navigator
    self.left = function() { move(self.slotActive.trayNo - 2); };
    
    self.right = function() { move(self.slotActive.trayNo); };
    
    self.up = function() { move(self.slotActive.trayNo - 21); };
    
    self.down = function() { move(self.slotActive.trayNo + 19); };
    
    function move(idx) {
        if(self.trays[idx]) {
            self.slotActive.isActive = false;
            self.trays[idx].isActive = true;
            self.slotActive = self.trays[idx];
        }
    }
    
    self.shuffle = function() {
        self.trays = _.shuffle(self.trays);
    };
    
    self.sortBy = function() {
        self.trays = _.sortBy(self.trays, function(t){ return -t.trayNo; });
    }
});

app.controller('defectController', function($modalInstance, defects, $log) {
    
    var self = this;
    self.defects = defects;
    self.tabs = [];
    
    var groupSize = 20;
    var tabSize = Math.ceil(self.defects.length / groupSize); // tab size 20 defects per tab
    
    for(var i = 0; i < tabSize; i++) {
        var defectGroup = [];
        var num = i * groupSize;
        
        for(var j = num; j < num + groupSize; j++) {
            if(self.defects[j] != undefined)
                defectGroup.push(self.defects[j]);
        }
        
        self.tabs.push({ title: defectGroup[0].Code[0] + ' - ' + defectGroup[defectGroup.length - 1].Code[0], defects: defectGroup });
    } 
    
    self.changeDefect = function(defect) {
        $modalInstance.close(defect);
    };

    self.clearDefect = function () {
        $modalInstance.close(null);
    };

    self.close = function () {
        $modalInstance.dismiss('cancel');
    };
});

angular.module('underscore', [])
    .factory('_', function($window) {
        return $window._;
    });

app.factory('trayService', function() {
    return {
        getTrayInfo: function() {
            return { tray: 'ST00010', type: 'FVMI', reworkCode: 'r', size: 80, type2: 'Scrape', closed: 'ยังไม่ได้ปิด Tray', clear: 'Tray ยังใช้งานอยู่', productPart: '11060-916', mptPartNo: 'MC-15508-03' };
        },
        getTrays: function() {
            var trays = [];
            for(var i = 1; i <= 80;i++) {
                if(i < 70)
                    trays.push({ trayNo: i, defectCode: 'DM100', en: '019715', clipNo: 'S497691T', hasChange: false, isActive: false });
                else
                    trays.push({ trayNo: i, defectCode: '', en: '', clipNo: '', hasChange: false, isActive: false });
            }
            return trays;
        },
        getDefects: function() {
            return defects.Defects;
        }
    };
});

app.directive('focus', function($timeout) {
    return {
        restrict: 'A',
        link: function($scope, el, attrs) {
            $scope.$watch(attrs.focus, function(newVal) {
                $timeout(function () {
                    el[0].focus();
                }, 0, false);
            });
        }
    };
});

app.directive('slot', function() {
    return {
        restrict: 'E',
        template: '<div>{{tray.trayNo}}</div>\
                   <div class="defectCode">{{tray.defectCode}}</div>\
                   <div class="en">{{tray.en}}</div>\
                   <div>{{tray.clipNo}}</div>'
    };
});