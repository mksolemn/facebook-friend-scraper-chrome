(function($) {

    $(document).ready(function() {

        //message passing
        chrome.runtime.sendMessage('Friend object passing away');

        console.log('FRIENDLIST IS RUNNING');

        var friendObject = {};
        var friendArray = [];
        var newFriendArray = []; // friend array with filtered names and IDs
        var visibleFriends = 0; // number of visible friends on the page
        var totalFriends = 0; // number of total friends retrieved from all friends page
        var scrollTopPixels = $(window).height() * 2;
        var scrollTopTime = 2500;
        var timeElapsed = 0;
        var scrollCounter = 1; // get how many times wa scrolled
        var startButtonState = 0;
        var previousFriendLength = 0;
        var friendLength = $('.uiProfileBlockContent').length;

        // elements
        var getFriendsButton = $('#get-all-friends');
        var stopGetFriendsButton = $('#stop-get-all-friends');



        // animate scroll
        var animateScroll = function() {
            $("body").animate({ scrollTop: scrollTopPixels * scrollCounter }, scrollTopTime, function() { friendRefresh(); });
        }

        var stopAnimateScroll = function() {
            $("body").finish();
            collectFriends();
            pushData(friendArray);
            exportJsonToCsv();

        }

        var pushData = function(user) {
            console.info('Friends have been pushed');
            $.ajax({
                type: "PUT",
                url: "https://jsonblob.com/api/jsonBlob/899712de-be27-11e6-871b-1de5240aad90",
                data: JSON.stringify(user),
                success: '',
                contentType: 'application/json',
                dataType: "json"
            });

        }

        var collectFriends = function() {
            var userId = 0;
            $('.uiProfileBlockContent').each(function() {

                friendObject = {
                    "id": userId,
                    "name": $(this).find('.fsl.fwb.fcb').children('a').text(),
                    "link": $(this).find('.fsl.fwb.fcb').children('a').attr('href')
                }
                userId += 1;

                friendArray.push(friendObject);

            });
        }

        var friendRefresh = function() {
            //check if exists
            if (startButtonState == 1) {
                setTimeout(function() {

                    friendLength = $('.uiProfileBlockContent').length;

                    console.log('Previous friend length: ' + previousFriendLength);
                    console.log('Current friend length: ' + friendLength);

                    if (previousFriendLength < friendLength) {
                        console.log('should animate');

                        animateScroll();

                    } else {
                        changeStartButton();
                        stopAnimateScroll();

                    }

                    previousFriendLength = friendLength;

                    scrollCounter += 1;

                }, 1500);
            }

        }

        var exportJsonToCsv = function() {

            var filteredID = '';
            var filteredName = '';
            var idPosition;
            var stringStartingAtId = '';
            var namePosition = '';


            //filter out IDs and usernames
            for (var i = 0; friendArray.length > i; i += 1) {

                idPosition = friendArray[i].link.search('id=');
                namePosition = friendArray[i].link.search('fref');

                if (idPosition != -1) {

                    filteredID = friendArray[i].link.slice(idPosition + 3, idPosition + 3 + 15);

                    friendObject = {
                        "id": friendArray[i].id,
                        "name": friendArray[i].name,
                        //"link": friendArray[i].link,
                        "user_id": filteredID
                    }

                    newFriendArray.push(friendObject);

                } else {

                    filteredName = friendArray[i].link.slice(('https://www.facebook.com/').length, namePosition - 1);

                    friendObject = {
                        "id": friendArray[i].id,
                        "name": friendArray[i].name,
                        //"link": friendArray[i].link,
                        "user_id": filteredName
                    }

                    newFriendArray.push(friendObject);

                }
            }

            console.log(newFriendArray);
            JSONToCSVConvertor(newFriendArray, "Friend Farm", true);
        }

        //generate CSV file

        function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
            var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

            var CSV = '';

            CSV += ReportTitle + '\r\n\n';

            if (ShowLabel) {
                var row = "";

                for (var index in arrData[0]) {

                    row += index + ',';
                }

                row = row.slice(0, -1);

                CSV += row + '\r\n';
            }

            for (var i = 0; i < arrData.length; i++) {
                var row = "";

                for (var index in arrData[i]) {
                    row += '"' + arrData[i][index] + '",';
                }

                row.slice(0, row.length - 1);

                CSV += row + '\r\n';
            }

            if (CSV == '') {
                alert("Invalid data");
                return;
            }

            // add report date
            var fileName = "";
            fileName += ReportTitle.replace(/ /g, "_");

            var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

            var link = document.createElement("a");
            link.href = uri;

            link.style = "visibility:hidden";
            link.download = fileName + ".csv";

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }


        //change ui button to "Cancel"
        var changeStartButton = function() {
            if (getFriendsButton.hasClass('hidden')) {
                getFriendsButton.removeClass('hidden');
                stopGetFriendsButton.addClass('hidden');
            } else {
                getFriendsButton.addClass('hidden');
                stopGetFriendsButton.removeClass('hidden');
            }
        }

        var launchTimer = function() {
            $('.control-wrapper').append('<div class="timer">' + timeElapsed + '</div>')
            setInterval(function() {
                timeElapsed += 1;
                $('.timer').text(timeElapsed);
            }, 1000)

        }

        // function runtime
        getFriendsButton.click(function() {
            startButtonState = 1;
            totalFriends = parseInt($('a[data-tab-key="friends"]').children('span:first-child').text().replace(/,/g, ''), 10);
            friendRefresh();
            changeStartButton();
            launchTimer();
        });

        stopGetFriendsButton.click(function() {
            startButtonState = 0;
            stopAnimateScroll();
            changeStartButton();
            collectFriends();

        });

        // each time dom refreshes check if it's the end of friend list if not repeat animatio
    });

})(jQuery);