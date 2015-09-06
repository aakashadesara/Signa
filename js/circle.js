$(window).load(function(){
  for (var i = 0; i < 70; i++) {
      var circlesW = $('.circles').width(),
          size = Math.floor(Math.random() * circlesW),
          borderW = Math.floor(Math.random() * 70),
          hue = Math.floor(Math.random() * 255),
          opac = Math.floor(Math.random() * 10),
          duration = Math.floor(Math.random() * 16) + 4,
          directions = ['normal','reverse'],
          direction = directions[Math.floor(Math.random() * directions.length)],
          borders = ['border-top-color','border-right-color','border-bottom-color','border-left-color'],
          border = borders[Math.floor(Math.random() * borders.length)];
      $('.circles').append('<div class="circle c'+ i +'"></div>');
      $('.c' + i).css({
          'width': size + 'px',
          'height': size + 'px',
          'border-width': borderW + 'px',
          'animation': 'z ' + duration + 's linear infinite '+ direction
      });
      $('.c' + i).css(border, 'rgba(' + hue + ',' + (hue+255)/2 + ',' + (hue+255)/2 + ', 0.' + opac/1.5 + ')');
  }
});
