export const fireRewardConfetti = (intensity: number = 0.4) => {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.inset = '0';
  container.style.pointerEvents = 'none';
  container.style.zIndex = '9999';
  document.body.appendChild(container);

  const colors = ['#06b6d4', '#38bdf8', '#34d399', '#f59e0b', '#ec4899'];
  const count = Math.floor(intensity * 40);

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = `${Math.random() * 8 + 4}px`;
    particle.style.height = `${Math.random() * 8 + 4}px`;
    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    particle.style.left = `${Math.random() * 100}vw`;
    particle.style.top = '-10px';
    particle.style.borderRadius = '50%';
    particle.style.opacity = Math.random().toString();
    
    container.appendChild(particle);

    const animation = particle.animate([
      { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
      { transform: `translateY(105vh) translateX(${(Math.random() - 0.5) * 100}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
    ], {
      duration: Math.random() * 1500 + 1500,
      easing: 'linear'
    });

    animation.onfinish = () => particle.remove();
  }

  setTimeout(() => container.remove(), 3100);
};
