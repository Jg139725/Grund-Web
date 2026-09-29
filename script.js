const observer = new IntersectionObserver((entries)=>{
  entries.forEach((entry)=>{
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
},{threshold:.12});
document.querySelectorAll('.reveal').forEach((el,i)=>{
  if(el.closest('.claim')) el.style.transitionDelay = `${i * 70}ms`;
  observer.observe(el);
});
