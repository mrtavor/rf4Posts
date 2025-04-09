function renderDots(posts) {
    const dotsLayer = document.getElementById("dots-layer");
    dotsLayer.innerHTML = ""; // очищаємо старі кружечки
  
    posts.forEach(post => {
      if (!post.coordinates) return;
  
      const match = post.coordinates.match(/(\d+):(\d+)/);
      if (!match) return;
  
      const gameX = parseInt(match[1]);
      const gameY = parseInt(match[2]);
  
      // 🔧 ТУТ НУЖНО НАЛАШТУВАТИ МАПУВАННЯ координат на пікселі — ПОКА ШО НА ОКО
      const mapWidth = 800;  // ширина картинки
      const mapHeight = 600; // висота картинки
  
      // Умовно перетворимо координати гри на пікселі
      const pxX = (gameX / 100) * mapWidth;
      const pxY = (gameY / 100) * mapHeight;
  
      const dot = document.createElement("div");
      dot.style.position = "absolute";
      dot.style.left = `${pxX}px`;
      dot.style.top = `${pxY}px`;
      dot.style.width = "10px";
      dot.style.height = "10px";
      dot.style.borderRadius = "50%";
      dot.style.backgroundColor = "red";
      dot.style.transform = "translate(-50%, -50%)";
      dot.style.boxShadow = "0 0 5px rgba(255,0,0,0.7)";
      dot.title = post.fish || "Риба";
  
      dotsLayer.appendChild(dot);
    });
  }
  