(function($) {

    $(document).ready(function() {

        // load up more friends
        if (document.getElementById('FriendRequestMorePager') !== null) {
            document.getElementById('FriendRequestMorePager').childNodes[0].childNodes[0].click();
        }

        // load controls
        $('body').append('<div class="control-wrapper"><button class="control-btn get-list"><span id="get-all-friends">Get Friends</span><span id="stop-get-all-friends" class="hidden">Stop</span></button><button class="control-btn collect-data"><span id="collect-friend-data">Collect Friend Data</span></button></div>');

    });

})(jQuery);