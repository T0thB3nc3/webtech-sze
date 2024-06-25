document.getElementById('fetch-ducks').onclick = fetchAndRenderDucks
document.addEventListener('DOMContentLoaded',loadDuckTypes)
// .getElementById -> id alapján megkeres egy HTML tag-et
async function loadDuckTypes(){
    console.log('fetch ducktypes: OK')
    const response = await fetch('/ducks/types')
    const ducktypes = await response.json()
    console.log(ducktypes)

    let ducktypesOptions = ''

    for( ducktype of ducktypes){
        ducktypesOptions +=`
        <option dataname=${ducktype.type} value=${ducktype.imglink}>${ducktype.type}</option>
        `
    }
    document.getElementById('selector').innerHTML = ducktypesOptions
}
async function IsNameStored(name){
    console.log('checking for name duplication.....')
    const response = await fetch('/ducks')
    const ducks= await response.json()
    console.log(ducks)
    for (duck of ducks){
        if(duck.name == name){
            return true}
    }
    return false
}
async function fetchAndRenderDucks(){
    console.log('fetch-ducks: OK')
    const response = await fetch(`/ducks`) // fetch -> adatok lekérése GET method, kommunikáció formátuma: string (szöveg)
    const ducks = await response.json();   // .json() > json formátumot 
                                            //          konvertál tömbbé
    console.log(ducks)

    let ducksHTML = '<br><div class="row">'

    // ciklus
    for(const duck of ducks){
        ducksHTML += `
        <div class="col-sm-6 col-md-4 col-lg-3 col-12 mt-4" >
            <div class="card">
                <div class="card-body">
                    <img class="img img-fluid" src="${duck.imglink}"alt="${duck.name} képe">
                    <h5 class="card-title mt-3">${duck.name}</h5>
                    <p class="card-text">Típusa: ${duck.type}</p>
                    <p class="card-text">Beköltözés dátuma: ${duck.addedAt}</p>
                </div>
            </div>
        </div>
        `;
    
    }
    ducksHTML += "</div>" // row záró tag-je

    document.getElementById('ducklist').innerHTML = ducksHTML
    // .innerHTML módosítja a html tag-ek tartalmát
}
document.getElementById('add-duck').onsubmit = async function(event){
    event.preventDefault(); // megakadájozza az oldal újratöltését
    //console.log('Form submit');
    //console.log(event);
    if (event.target.elements.name.value !== '' && IsNameStored(event.target.elements.name.value)){
        console.log("Kacsa neve:"+event.target.elements.name.value);
        let mySelect = document.getElementById('selector');
        let selectedOption = mySelect.options[mySelect.selectedIndex];
        const type = selectedOption.textContent; 
        const name = event.target.elements.name.value
        const imglink =event.target.elements.selector.value
        const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const res = await fetch('/ducks',{
            method: 'POST',
            headers: {'content-type':'application/json'},
            body: JSON.stringify(
            {
            "name":name,
            "type":type,
            "imglink":imglink,
            "addedAt":date
            },
        ) 
        });
    } else{
        let errormsg = 'Hiba történt!\n'
        if(event.target.elements.name.value === '')errormsg+='Nincs megadott név!\n'
        if(IsNameStored(event.target.elements.name.value))errormsg+='A megadott név már szerepel a kacsák között!\n'
        alert(errormsg)
    }


    if (res.ok){
        // sikerült a küldés
    } else {
        // nem sikerült a küldés
        alert('Server error!');
    }
}
