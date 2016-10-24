// Generated by CoffeeScript 1.10.0
(function() {
  $(function() {
    return window.onload = function() {
      var canvas, ctx, i, img, j, k, nbX, nbY, r, ref, results;
      canvas = document.getElementById('c');
      ctx = canvas.getContext('2d');
      canvas.width = document.body.clientWidth;
      canvas.height = document.body.clientHeight;
      img = new Image();
      img.src = 'img/spriteGlobal.png';
      nbX = canvas.width / 10;
      nbY = canvas.height / 10;
      results = [];
      for (i = k = 0, ref = nbX; 0 <= ref ? k <= ref : k >= ref; i = 0 <= ref ? ++k : --k) {
        results.push((function() {
          var l, ref1, results1;
          results1 = [];
          for (j = l = 0, ref1 = nbY; 0 <= ref1 ? l <= ref1 : l >= ref1; j = 0 <= ref1 ? ++l : --l) {
            r = Math.random() >= 0.5 ? 0 : 10;
            results1.push(ctx.drawImage(img, r, 10, 10, 10, i * 10, j * 10, 10, 10));
          }
          return results1;
        })());
      }
      return results;
    };
  });

}).call(this);
