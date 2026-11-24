(async()=>{
 const root=document.getElementById('dynamic-recipe');
 const slug=new URLSearchParams(location.search).get('slug');
 const add=(tag,text)=>{const el=document.createElement(tag);el.textContent=text;root.append(el);return el;};
 try {
 if(!slug || !/^[a-z0-9-]+$/.test(slug)) throw Error();
 const res=await fetch('/api/recipes/'+encodeURIComponent(slug)); if(!res.ok) throw Error(); const r=await res.json();
 root.replaceChildren(); document.title=r.name+' | TheFlavorFind'; add('h1',r.name);add('p',r.description);add('p',`${r.prepTime+r.cookTime} min · ${r.servings} doses · ${r.difficulty}`);
 if(typeof r.image==='string' && /^\/images\/[a-z0-9/_\-.]+$/i.test(r.image)){const img=document.createElement('img');img.src=r.image;img.alt=r.imageAlt||r.name;img.style.maxWidth='100%';root.append(img);}
 add('h2','Ingredientes');for(const i of r.ingredients) add('p',i.quantity+' — '+i.item);
 add('h2','Preparação');r.instructions.forEach((i,n)=>{add('h3',`${n+1}. ${i.title}`);add('p',i.text);});
 if(r.tips?.length){add('h2','Dicas');r.tips.forEach(t=>add('p',t));}add('h2','Alergénios');add('p',(r.allergens||[]).join(', ')||'Verifique os ingredientes.');add('p',r.allergenNote||'');add('h2','Conservação');add('p',r.storage||'');add('p','Imagem ilustrativa. Receita não testada em cozinha pela equipa.');
 }catch{root.textContent='Não foi possível carregar a receita. Volte ao catálogo e tente novamente.';}
})();
