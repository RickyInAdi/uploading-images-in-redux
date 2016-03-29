testServer401Response(file, fileDataUrl) {
   
   // Setup all the mocking first
   
   mockHttp()
      .post("/images", new FormData(file))
      .reply(401, "Unauthorized");
   
   var dispatcher = initMockDispatcher();
   
   monkeyPatchReadAsDataUrl(file, fileDataUrl);


   onDropImage(file, dispatcher.dispatch);
   // Pretend we know how to block until this is done

   ASSERT_EQUAL(
      dispatcher.getActions(),
      [
         { type: "START_UPLOADING" },
         { type: "SET_IMAGE", url: fileDataUrl },
         { type: "REMOVE_IMAGE" },
         { TYPE: "STOP_UPLOADING" }
      ]
   );

}

afterEachTest(function() {
   nock.cleanAll();
   cleanMockDispatcher();
   unMonkeyPatchReadAsDataUrl();
});

var originalReadAsDataUrl = null;
function monkeyPatchReadAsDataUrl(file, result) {
   originalReadAsDataUrl = readAsDataURL;
   readAsDataURL = function(f) {
      ASSERT_EQUAL(f, file);
      return Promise.resolve(result);
   }
}

function unMonkeyPatchReadAsDataUrl() {
   readAsDataURL = originalReadAsDataUrl;
}
