const grid=document.getElementById("book-grid");
const bookDialog=document.getElementById("book-dialog");

// Add only genuine reader comments here after reviewing them and receiving permission.
const approvedReflections=[];

function escapeHtml(value){
  return String(value).replace(/[&<>"']/g,char=>({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[char]));
}

function coverUrl(book){
  return book.cover ? encodeURIComponent(book.cover) : "";
}

function makeCard(book){
  const card=document.createElement("button");
  card.className="book-card";
  card.type="button";
  card.setAttribute("aria-label","View details for "+book.title);
  const cover=coverUrl(book);
  card.innerHTML=
    '<div class="cover-wrap">'+
      (cover
        ? '<img class="book-cover" src="'+escapeHtml(cover)+'" alt="Cover of '+escapeHtml(book.title)+'" loading="lazy">'
        : '<div class="cover-placeholder">Cover image coming soon</div>')+
    '</div>'+
    '<div class="book-title">'+escapeHtml(book.title)+'</div>'+
    '<div class="book-language">'+escapeHtml(book.language)+'</div>';
  const image=card.querySelector("img");
  if(image) image.addEventListener("error",()=>{
    const placeholder=document.createElement("div");
    placeholder.className="cover-placeholder";
    placeholder.textContent="Cover image coming soon";
    image.replaceWith(placeholder);
  });
  card.addEventListener("click",()=>openBook(book));
  grid.append(card);
}

function openBook(book){
  document.getElementById("detail-title").textContent=book.title;
  document.getElementById("detail-language").textContent=book.language;
  document.getElementById("detail-description").textContent=book.description || "";
  const detailCover=document.getElementById("detail-cover");
  const cover=coverUrl(book);
  detailCover.innerHTML=cover
    ? '<img class="book-cover" src="'+escapeHtml(cover)+'" alt="Cover of '+escapeHtml(book.title)+'">'
    : "Cover image coming soon";
  const image=detailCover.querySelector("img");
  if(image) image.addEventListener("error",()=>{
    detailCover.textContent="Cover image coming soon";
  });
  bookDialog.showModal();
}

function renderReflections(){
  const container=document.getElementById("testimonials");
  if(!approvedReflections.length) return;
  container.replaceChildren();
  approvedReflections.forEach(reflection=>{
    const article=document.createElement("article");
    article.className="reflection-card";
    const quote=document.createElement("blockquote");
    quote.textContent="“"+reflection.text+"”";
    const attribution=document.createElement("p");
    attribution.className="reflection-attribution";
    attribution.textContent=reflection.attribution || "A reader";
    article.append(quote,attribution);
    container.append(article);
  });
}

document.getElementById("close-dialog").addEventListener("click",()=>bookDialog.close());
bookDialog.addEventListener("click",event=>{
  if(event.target===bookDialog) bookDialog.close();
});

const feedbackForm=document.getElementById("feedback-form");
feedbackForm.addEventListener("submit",async event=>{
  event.preventDefault();
  const status=document.getElementById("feedback-status");
  const submit=feedbackForm.querySelector('button[type="submit"]');
  const formData=new FormData(feedbackForm);
  const message=String(formData.get("message") || "").trim();
  if(message.length<3){
    status.textContent="Please add a little more detail before submitting.";
    return;
  }
  submit.disabled=true;
  status.textContent="Sending your feedback…";
  try{
    const response=await fetch("/api/feedback",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        message,
        permission:formData.get("permission")==="on",
        website:String(formData.get("website") || "")
      })
    });
    if(!response.ok) throw new Error("Feedback service unavailable");
    feedbackForm.reset();
    status.textContent="Thank you. Your feedback has been received.";
  }catch(error){
    status.textContent="Feedback is not available just yet. Please try again later.";
  }finally{
    submit.disabled=false;
  }
});

renderReflections();

fetch("catalogue.json")
  .then(response=>{
    if(!response.ok) throw new Error("Catalogue unavailable");
    return response.json();
  })
  .then(books=>{
    if(!Array.isArray(books)||books.length===0){
      grid.textContent="The collection will be available here soon.";
      return;
    }
    books.forEach(makeCard);
  })
  .catch(()=>{
    grid.textContent="The book catalogue could not be loaded. Please refresh the page.";
  });
