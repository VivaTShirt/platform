//evento que faz a search bar aparecer e desaparecer
document.getElementById("toggleSearchBar").addEventListener("click", () => {

    let searchBarEl = document.getElementById('searchBar');

    if (searchBarEl.classList.contains("opacity-0")) {
        searchBarEl.classList.remove("opacity-0");        
    } else {
        searchBarEl.classList.add("opacity-0");
    }

});

//modal de carrinho
