/* HaxTabs jQuery Plugin */
;(function ( $, window, document, undefined ) {

    var pluginName = "haxtabs",
        defaults = {};

    function Plugin( element, options ) {
        this.element = element;
        this.$elem = $(this.element);
        this.options = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype = {

        init: function() {
            //get components
            var menuLinks = this.$elem.find('.tab-menu a');
            var firstMenuItem = $(menuLinks.eq(0)).addClass('active');
            var panelsContainer = this.$elem.find('.tab-panels-container');
            var panels = panelsContainer.children();
            var firstPanel = panels.filter(firstMenuItem.attr('href')).addClass('active');
            var pointer = this.$elem.find('.tab-menu-pointer');
            var pointerGutter = this.$elem.find('.tab-menu-pointer-gutter');
            var currentMenuItem = firstMenuItem;
            var currentPanel = firstPanel;

            //panels are absolute position so their width needs fixing
            //Alt method panels.width(panelsContainer.width());
            panels.css('left', panelsContainer.css('padding-left'));
            panels.css('right', panelsContainer.css('padding-right'));

            //make sure the gutter is the same height as the pointer
            pointerGutter.height(pointer.outerHeight()); 

            function setPointerTarget(menuItem){
                if(pointer.length <= 0)return false;
                pointer.css('left', menuItem.offset().left - pointerGutter.offset().left + menuItem.outerWidth()*.5 - pointer.outerWidth()*.5);
                pointer.css('top', panelsContainer.offset().top - pointerGutter.offset().top - pointer.outerHeight());
            }
            function resizeContainerToPanel(panel){
                //panelsContainer's size needs setting in js because absolute positioning removes auto-layout
                panelsContainer.height(panel.height());
            }

            //set pointer position
            setPointerTarget(currentMenuItem);
            pointer.addClass('animated');
            //fit container to contents
            resizeContainerToPanel(currentPanel);
            panelsContainer.addClass('animated');

            //need to repoint if content has reflowed
            var lastMIX = currentMenuItem.offset().left;
            var lastPCHeight = currentPanel.height();
            $(window).resize(function(event) {
                //repoint
                if(currentMenuItem.offset().left != lastMIX){
                    pointer.removeClass('animated');
                    setPointerTarget(currentMenuItem);
                    lastMIX = currentMenuItem.offset().left;
                    pointer.addClass('animated');
                }

                //resize container
                if(currentPanel.height() != lastPCHeight){
                    panelsContainer.removeClass('animated');
                    resizeContainerToPanel(currentPanel);
                    lastPCHeight = currentPanel.height();
                    panelsContainer.addClass('animated');
                }
            });

            menuLinks.bind('click', this.options, function(e){
                e.preventDefault();
                var menuItem = $(this);
                var effect = e.data.effect;
                var link = menuItem.attr('href');

                menuLinks.removeClass('active');
                menuItem.addClass('active');

                currentMenuItem = menuItem;

                var currentlyActive = panels.filter('.active');
                var targetPanel = panels.filter(link);

                //fade transition
                panels.removeClass('active');
                targetPanel.addClass('active');
                
                currentPanel = targetPanel;
                resizeContainerToPanel(currentPanel);
                //point to
                setPointerTarget(menuItem);
            });     
        },
    };

    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName,
                new Plugin( this, options ));
            }
        });
    };

})( jQuery, window, document );


