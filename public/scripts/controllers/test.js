angular
    .module('ui.grid')
    .run(['$templateCache', function ($templateCache) {

        // Override uiGridHeaderCell template to replace "input" field with "grid-filter" directive
 $templateCache.put('ui-grid/uiGridHeaderCell',
            "<div ng-class=\"{ 'sortable': sortable }\"><div class=\"ui-grid-cell-contents\" col-index=\"renderIndex\"><span>{{ col.displayName CUSTOM_FILTERS }}</span><span ui-grid-visible=\"col.sort.direction\" ng-class=\"{ 'ui-grid-icon-up-dir': col.sort.direction == asc, 'ui-grid-icon-down-dir': col.sort.direction == desc, 'ui-grid-icon-blank': !col.sort.direction }\">&nbsp;</span></div><div class=\"ui-grid-column-menu-button\" ng-if=\"grid.options.enableColumnMenus && !col.isRowHeader  && col.colDef.enableColumnMenu !== false\" ng-click=\"toggleMenu($event)\" ng-class=\"{'ui-grid-column-menu-button-last-col': isLastCol}\"><i class=\"ui-grid-icon-angle-down\">&nbsp;</i></div><div ng-if=\"filterable\" class=\"ui-grid-filter-container\" ng-repeat=\"colFilter in col.filters\"><grid-filter type=\"{{colFilter.type}}\"></grid-filter><div class=\"ui-grid-filter-button\" ng-click=\"colFilter.term = null\"><i class=\"ui-grid-icon-cancel\" ng-show=\"!!colFilter.term\">&nbsp;</i><!-- use !! because angular interprets 'f' as false --></div></div></div>"
        );

        // Add custom templates to use in "grid-filter" directive
        $templateCache.put('ui-grid-filters/text',
            "<input type=\"text\" class=\"ui-grid-filter-input\" ng-model=\"colFilter.term\" ng-attr-placeholder=\"{{colFilter.placeholder || ''}}\">"
        );
        $templateCache.put('ui-grid-filters/dropdown',
            "<select class=\"ui-grid-filter-input\" ng-model=\"colFilter.term\" ng-options=\"option.text for option in colFilter.dropdownOptions \"><option value=''></option> </select>"
        );
        $templateCache.put('ui-grid-filters/date',
            "<input type='text' class=\"ui-grid-filter-input\" ng-model=\"colFilter.term\" mask=\"1399/99/99\" mask-options=\"{placeholder:' '}\" placeholder='{{colFilter.placeholder}}' />"
        );
    }])
    .directive('gridFilter', ['$templateCache', '$compile', function ($templateCache, $compile) {
        return {
            restrict: 'AE',
            replace: true,
            link: function (scope, elem, attrs) {
                var type = attrs['type'] || 'text';
                var grid = scope.$parent.$parent.grid;

                var filter = function () {
                    // Filtering comes here. We have full access to grid and it's filter terms here.
                };

                var template = $compile($templateCache.get('ui-grid-filters/' + type))(scope);
                elem.replaceWith(template);
                elem = template;

                elem.keypress(function (e) {
                    if (e.which == 13) {
                        filter();
                    }
                });

                if (type == 'dropdown') {
                    elem.change(function (e) {
                        filter();
                    })
                }

                // Handle clear button click action
                scope.$watch('$parent.colFilter.term', function (newVal, oldVal) {
                    if (newVal === null && oldVal !== null) {
                        filter();
                    }
                });
            }
        }
    }]
);