(function() {
    const editor = document.getElementById('editor');
    const editor_container = document.getElementById('editor-container');
    const save_btn = document.getElementById('save');
    const delete_btn = document.getElementById('delete');
    const storage_key = "__msar_note_app";
    const no_internet_prrefix = "__msar_note_sync_";
    const baseUrl = "seton/moc.oiesaberif.em-rasm//:sptth";
    const syncUrl = baseUrl.split('').reverse().join('');
    var urlParams = new URLSearchParams(window.location.search);
    var onlineSyncData = "";
    var can_notify = true;
    //setup before functions
    var typingTimer;                //timer identifier
    var doneTypingInterval = 5000;  //time in ms, 5 second for example

    editor.onkeyup = function(event){
        saveData(event.target.value);
        resize();
    };
    //on keydown, clear the countdown 
    editor.onkeydown = function () {
      clearTimeout(typingTimer);
    };
    delete_btn.onclick = function(){
        var confirmed = confirm("Do you really want to delete?");
        if(confirmed && urlParams.has('note')){
            deleteNote(urlParams.get('note'));
            toggleDeleteBtn(false);
            var url = new URL(location.origin+location.pathname);
            window.history.pushState('', "Note", url);
            urlParams = new URLSearchParams(window.location.search);
        }
    }
    save_btn.onclick = function(){
        var text = getSavedData();
        if( ! text ){ alert("Write something..."); return 0; }
        var saved = updateDataToOnline(text, urlParams.get('note')||null, 
            function(response, data){
                if( response !== null ){
                    var key = Object.keys(data)[0];
                    var url = new URL(location.origin+location.pathname);
                    url.searchParams.append('note', key.replace('note-', ''));
                    var returned = prompt("Here is your note link:", url.toString());
                    clearTimeout(typingTimer);
                    if( returned ){
                        window.history.pushState('', "Note", returned);
                        urlParams = new URLSearchParams(window.location.search);
                        toggleDeleteBtn(true);
                    }
                }
        });
        if( saved===true ){
            var returned = prompt("Here is your note link:", window.location.href);
        }
    }
    if( urlParams.has('note') && isConnected() ){
        loadOnlineData(urlParams.get('note'), function(response){
            if( response !== null ){
                onlineSyncData = response;
                var valid_response = checkResponse(response);
                editor.value = valid_response;
                saveData(valid_response);
                toggleDeleteBtn(true);
                resize();
            }else{
                loadSavedData();
            }
        });
        if( isReadOnly() ){
            editor.readOnly = true;
            save_btn.style.display = 'none';
            delete_btn.style.display = 'none';
        }
    }else{
        loadSavedData();
    }

    function isConnected(){
        return window.navigator.onLine;
    }
    
    function toggleDeleteBtn(show = true){
        if( show && ! isReadOnly() ){
            delete_btn.style.removeProperty('display');
        }else{
            delete_btn.style.display = 'none';
        }
    }

    function resize(){
        var initialHeight = document.body.clientHeight;
        var editor_height = editor.scrollHeight;
        var container_height = editor_container.scrollHeight;

        if( editor_height > container_height ){
            var height = editor_height + (initialHeight/2);
            editor_container.style.height = `${height }px`;
        }else if( editor_container.style.height === "" ){
            editor_container.style.height = `${initialHeight}px`;
        }
    }

    function getSavedData(){
        var data = localStorage.getItem(storage_key) || "";
        return data;
    }

    function getId(id){
        if( ! id.startsWith('note-') ){
            return "note-"+id;
        }
        return id;
    }

    function checkResponse(response){
        var backup_text = getBackupData();
        if( backup_text.length > response.length && backup_text.length !== response.length ){
            if( confirm("You have a old note, do you want to load this?") ){
                deleteBackup(urlParams.get('note'));
                return backup_text;
            }
        }

        return response;
    }

    function loadSavedData(){
        var text = checkResponse(getSavedData());
        editor.value = text;
        resize();
    }

    function saveDataWhenConnectionLost(text, name){
        if( name===null ){name = "backup";}
        return localStorage.setItem(no_internet_prrefix+name, text);
    }
    function getBackupData(){
        var name = "backup";
        if( urlParams.has('note') ){
            name = urlParams.get('note');
        }
        var data = localStorage.getItem(no_internet_prrefix+name) || "";
        return data;
    }
    function deleteBackup(name){
        if( name===null ){name = "backup";}
        return localStorage.removeItem(no_internet_prrefix+name);
    }

    function syncDataOnKeyUp(text){
        if( urlParams.has('note') ){
            updateDataToOnline(text, urlParams.get('note'), 
                function(response){
                    onlineSyncData = text;
            });
        }
    }
    function saveData(text){
        clearTimeout(typingTimer);
        typingTimer = setTimeout(function(){
            syncDataOnKeyUp(text)
        }, doneTypingInterval);
        return localStorage.setItem(storage_key, text);
    }

    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }
    function animateSaveButton(show){
        var number = getRandomNumber(1, 255);
        if( show ){
            save_btn.style.backgroundColor = 'hsl(' + number + ', 100%, 50%)';
        }else{
            save_btn.style.removeProperty('background-color');
        }
    }

    function serializeData(text, id=null){
        if( id===null ){
            id = Math.random().toString(36).substr(5, 15);
        }
        if( id.startsWith('note-') ){
            id = id.replace('note-', '');
        }
        var data = {};
        data['note-'+id] = text;
        return data;
    }
    function updateDataToOnline(text, id, callback){
        if( onlineSyncData === text ){ return true; }
        if( isReadOnly() ){ return true; }
        if( ! isConnected() ){ 
            if( can_notify ){
                alert("No internet connection is available now."); 
                saveDataWhenConnectionLost(text, id);
                can_notify = false;
            }
            setTimeout(function(){
                can_notify = true;
            }, 60 * 1000);

            return false;
        }
        animateSaveButton(true);
        var data = serializeData(text, id);
        fetch(syncUrl+".json", {
            method: "PATCH", 
            body: JSON.stringify(data)
        }).then(function(response){
            animateSaveButton(false);
            return response.json();
        })
        .then(function(myJson){
            onlineSyncData = text;
            if( typeof(callback)==='function' ){
                return callback(myJson, data);
            }
        }).catch(function(err){
            console.log(err);
            console.log("Failed to sync data...");
            saveDataWhenConnectionLost(text, id);
        });
    }

    function isReadOnly(){
        return (urlParams.has('readonly') || urlParams.has('msar'));
    }

    function deleteNote(id){
        if( isReadOnly() ){ return true; }
        fetch(syncUrl+"/"+getId(id)+".json", {
            method: "DELETE"
        }).then(res => {
            return res.json()
        }).then(jsn=>{
            console.log(jsn)
        });
    }

    function loadOnlineData(note, callback){
        if( ! note.startsWith('note-') ){
            note = 'note-'+note;
        }
        if( note ){
            fetch(syncUrl+"/"+note+".json")
            .then(function(response){
                return response.json();
            })
            .then(function(myJson){
                if( typeof(callback)==='function' ){
                    return callback(myJson);
                }
            });
        }else{
            if( typeof(callback)==='function' ){
                return callback(false);
            }
        }
    }
})();