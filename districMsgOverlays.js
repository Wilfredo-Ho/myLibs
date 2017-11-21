	function ComplexCustomOverlay(point, text, isProvince, mapObj){
      this._point = point;
      this._text = text;
      this.isProvince = isProvince;  //省、市区分
      this.mapObj = mapObj;
    }

    ComplexCustomOverlay.prototype = new BMap.Overlay();
    
    ComplexCustomOverlay.prototype.initialize = function(map){
      this._map = map;
      var div = this._div = document.createElement("div");
      div.style.position = "absolute";
      div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);

      if(this.isProvince){
        div.style.backgroundColor = "#6caeca";    
        div.style.border = "1px solid #5993af";   
      }else{
        div.style.backgroundColor = "#ff9625";    
        div.style.border = "1px solid #d5851f";   
      }
      
      div.style.color = "#fff";
      div.style.height = "30px";
      div.style.padding = "4px";
      div.style.lineHeight = "22px";
      div.style.whiteSpace = "nowrap";
      div.style.MozUserSelect = "none";
      div.style.fontSize = "14px";
      div.style.borderRadius = "6px";
      div.style.boxShadow = "1px 1px #6b7d7b";
      var span = this._span = document.createElement("span");
      div.appendChild(span);
      span.appendChild(document.createTextNode(this._text));      
      var that = this;

      var arrow = this._arrow = document.createElement("div");
      arrow.style.background = "url(http://map.baidu.com/fwmap/upload/r/map/fwmap/static/house/images/label.png) no-repeat";
      arrow.style.position = "absolute";
      arrow.style.width = "11px";
      arrow.style.height = "10px";
      arrow.style.top = "28px";
      arrow.style.left = "10px";
      arrow.style.overflow = "hidden";
      div.appendChild(arrow);

      if(this.isProvince){
        arrow.style.backgroundPosition = '0px -20px';
      }else{
        arrow.style.backgroundPosition = '0px -10px';   
      }

      this.mapObj.getPanes().labelPane.appendChild(div);
      
      return div;
    }

    ComplexCustomOverlay.prototype.draw = function(){
      var map = this._map;
      var pixel = map.pointToOverlayPixel(this._point);
      this._div.style.left = pixel.x - parseInt(this._arrow.style.left) + "px";
      this._div.style.top  = pixel.y - 30 + "px";
    }
