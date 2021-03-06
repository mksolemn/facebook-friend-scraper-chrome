// load external scripts
function loadJquery() {
    chrome.tabs.executeScript({
        file: 'js/vendor/jquery-3.1.1.min.js'
    })
}

function loadAcceptScript() {
    chrome.tabs.executeScript({
        file: 'js/clickerscript.js'
    })
}


function loadLoginScript() {
    chrome.tabs.executeScript({
        file: 'js/login.js'
    })
}

function loadFriendList() {
    chrome.tabs.executeScript({
        file: 'js/friendlist.js'
    })
}

(function($) {

    console.log('popup.js is running');
    document.addEventListener('DOMContentLoaded', function() {

        //controls
        loadJquery();

        $('#login').on('click', function() {
            loadLoginScript();
        });

        $('#runAcceptor').on('click', function() {
            loadAcceptScript();
        });

        $('#getFriendList').on('click', function() {
            loadFriendList();
        })

    }, false);


})(jQuery);