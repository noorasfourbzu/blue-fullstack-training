class Game {
    constructor(id,title,category,description,releaseYear){
        this.id = id;
        this.title = title; 
        this.category= category;
        this.description = description;
        this.releaseYear = releaseYear ;

    }
// getters
    get title(){ return this._title;}
    get category(){return this._category;}
    get description(){return this._description;}
    get releaseYear(){return this._releaseYear;}
    get id(){return this._id;}
// setters
set title(title){ this._title = title;}
set category(category){this._category = category;}
set description(description){this._description = description;}
set releaseYear(releaseYear){this._releaseYear =releaseYear;}
set id(id){this._id = id;}
}