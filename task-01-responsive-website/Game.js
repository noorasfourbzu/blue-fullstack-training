class Game {
    
    constructor(title,category,description,icon){
        this.title = title; 
        this.category= category;
        this.description = description;
        this.icon = icon ;

    }
// getters
    get title(){ return this._title;}
    get category(){return this._category;}
    get description(){return this._description;}
    get icon(){return this._icon;}
// setters
set title(title){ this._title = title;}
set category(category){this._category;}
set description(description){this._description = description;}
set icon(icon){this._icon =icon;}
}