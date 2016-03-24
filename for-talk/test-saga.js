testServer401Response(file, fileDataUrl) {

   const effects = uploadImage({ type: "DROP_IMAGE", file: file });

   ASSERT_EQUAL(
      effects.next().value,
      put({ type: "START_UPLOADING" })
   );
   
   ASSERT_EQUAL(
      effects.next().value,
      call(readAsDataURL, file)
   );

   ASSERT_EQUAL(
      effects.next(fileDataUrl).value,
      put({ type: "SET_IMAGE", url: fileDataUrl })
   );

   ASSERT_EQUAL(
      effects.next().value,
      call(http.post, "/images", new FormData(file))
   );
   
   ASSERT_EQUAL(
      effects.next({ status: 401, statusText: "Unauthorized" }).value
      put({ type: "REMOVE_IMAGE" });
   );
   
   ASSERT_EQUAL(
      effects.next().value
      put({ type: "STOP_UPLOADING" });
   );

}
