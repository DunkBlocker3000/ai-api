<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>API Documentation URL</title>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script>
      $(function() {
        $('form').submit(function(event) {
          event.preventDefault();
          var url = $('#url').val();
          $.ajax({
            url: '/process-url',
            type: 'POST',
            data: { url: url },
            success: function(response) {
              alert('URL processed successfully!');
            },
            error: function() {
              alert('Error processing URL!');
            }
          });
        });
      });
    </script>
  </head>
  <body>
    <h1>API Documentation URL</h1>
    <form>
      <label for="url">Enter the URL of the API documentation:</label>
      <br>
      <input type="text" id="url" name="url" size="50">
      <br><br>
      <input type="submit" value="Submit">
    </form>
  </body>
</html>