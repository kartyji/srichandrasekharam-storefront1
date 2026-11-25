let books=[];
const grid=document.getElementById("book-grid");
const bookDialog=document.getElementById("book-dialog");
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function coverUrl(book){return book.cover ? encodeURIComponent(book.cover) : "";}
function makeCard(book){
  const card=document.createElement("button");card.className="book-card";card.type="button";
  const cover=coverUrl(book);
  card.innerHTML='<div class="cover-wrap">'+(cover?'<img class="book-cover" src="'+escapeHtml(cover)+'" alt="Cover of '+escapeHtml(book.title)+'" loading="lazy">':'<div class="cover-placeholder">Cover image coming soon</div>')+'</div><div class="book-title">'+escapeHtml(book.title)+'</div><div class="book-language">'+escapeHtml(book.language)+'</div>';
  card.addEventListener("click",()=>openBook(book));grid.append(card);
}
function openBook(book){
  document.getElementById("detail-title").textContent=book.title;
  document.getElementById("detail-language").textContent=book.language;
  document.getElementById("detail-preface").textContent=book.preface;
  const detailCover=document.getElementById("detail-cover");
  const cover=coverUrl(book);
  detailCover.innerHTML=cover?'<img class="book-cover" src="'+escapeHtml(cover)+'" alt="Cover of '+escapeHtml(book.title)+'">':'Cover image will appear here';
  bookDialog.showModal();
}
document.getElementById("close-dialog").onclick=()=>bookDialog.close();
fetch("catalogue.json").then(r=>{if(!r.ok)throw new Error("Catalogue unavailable");return r.json();}).then(data=>{books=data;books.forEach(makeCard);}).catch(()=>{grid.textContent="The book catalogue could not be loaded. Please refresh the page.";});