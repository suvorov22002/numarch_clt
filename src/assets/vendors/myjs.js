var myExtObject = (function() {

    return {
      func1: function() {
        //alert('function 1 called');
		$('button').click(function () {
        $('button').removeClass('active');
        $(this).addClass('active');
        });
      },
      func2: function() {
        alert('function 2 called');
      }
    }

})(myExtObject||{})
