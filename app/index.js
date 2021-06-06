class Section {

    constructor() {
        this.id = "";
        this.title = "";
        this.items = [];
        this.active = false;
    }

    getHtml() {
        return `<div id="${this.id}" class="section-container">
        ${ this.items.map( ( item ) => item.getHtml() ).join( "" ) }
        </div>`;
    }
}

class Group {

    constructor() {
        this.id = "";
        this.title = "";
        this.link = "";
        this.items = [];
        this.parent = {};
    }

    click() {
        const copyTextElement = document.createElement( "textarea" );
        copyTextElement.value = this.link;
        copyTextElement.setAttribute( "readonly", "" );
        copyTextElement.style.position = "absolute";
        copyTextElement.style.left = "-9999px";
        document.body.appendChild( copyTextElement );
        copyTextElement.select();
        document.execCommand( "copy" );
        document.body.removeChild( copyTextElement );
    }

    getHtml() {
        return `<div class="body-item hvr-glow" id="${this.id}">
            <div class="body-item-header">
                <div class="body-item-header-title"><a href="${this.link}" target="_blank">${this.title}</a></div>
                <div class="body-item-header-shapes">
                    <div class="body-item-header-shape-1"></div>
                    <div class="body-item-header-shape-2"></div>
                </div>
                <div class="body-item-header-icon hvr-grow"><i id="C${this.id}Link" class="fa fa-link"></i></div>
            </div>
            <div class="body-item-body">
            ${ this.items.map( ( item ) => item.getHtml() ).join( "" ) }
            </div>
        </div>`;
    }
}

class GroupItemType {

    // Title.
    static get Title() {
		return 1;
    }

    // User Name.
    static get UserName() {
		return 2;
    }
    
    // Password.
    static get Password() {
		return 3;
    }
    
    // Email.
    static get Email() {
		return 4;
    }
}

class GroupItem {

    constructor() {
        this.id = "";
        this.value = "";
        this.type = 0;
        this.parent = {};
    }

    click() {
        const copyTextElement = document.createElement( "textarea" );
        copyTextElement.value = this.value;
        copyTextElement.setAttribute( "readonly", "" );
        copyTextElement.style.position = "absolute";
        copyTextElement.style.left = "-9999px";
        document.body.appendChild( copyTextElement );
        copyTextElement.select();
        document.execCommand( "copy" );
        document.body.removeChild( copyTextElement );
    }

    getHtml() {
        const icons = {
            "2": "fa fa-user",
            "3": "fa fa-lock",
            "4": "fa fa-envelope"
        };

        let value = "";
        if( this.type === 3 ) {
            value = `<span>•••••••</span>`;
        } else {
            value = `<span>${this.value}</span>`;
        }

        return value ? `<div class="body-item-body-item" id="${this.id}">
            <div class="body-item-body-item-icon"><i class="${icons[`${this.type}`]}"></i></div>
            <div class="body-item-body-item-title">${value}</i></div>
            <div class="body-item-body-item-copy hvr-grow"><i id="C${this.id}" class="fa fa-clone"></i></div>
        </div>` : "";
    }
}

class Root {

    constructor() {
        this.sections = [];
    }

    get activeSection() {
        return this.sections.find( ( i ) => i.active );
    }

    set activeSection( sectionId ) {
        this.sections.forEach( ( section ) => {
            if( section.id === sectionId ) {
                section.active = true;
            } else {
                section.active = false;
            }
        } );
    }

    createSection( groups, sectionName ) {
        const sectionId = this.sections.length;

        const section = new Section();
        section.id = `S${sectionId}`;
        section.title = sectionName;
        let groupId = 0;
        groups.forEach( ( item ) => {
            const group = new Group();
            group.id = `${section.id}G${groupId++}`;
            group.parent = section;
            let groupItemId = 0;
            for( const key in item ) {
                if( item.hasOwnProperty( key ) ) {
                    if( key === "Name" ) {
                        group.title = item[ key ];
                    } else if( key === "Link" ) {
                        group.link = item[ key ];
                    } else {

                        if( item[ key ] ) {
                            const groupItem = new GroupItem();
                            groupItem.id = `${group.id}GI${groupItemId++}`;
                            groupItem.value = item[ key ];
                            groupItem.type = GroupItemType[ key ];
                            groupItem.parent = group;
                            group.items.push( groupItem );
                        }
                        
                    }
                }
            }
            section.items.push( group );
        } );

        this.sections.push( section );;
    }

    getHeaderHtml() {
        return `<div>
            ${this.sections.map( ( section ) => `<div id="H${section.id}" class="header-item hvr-bubble-float-left ${section.active ? "active" : ""}">${section.title}</div>`).join( "" ) }
        </div>`;
    };
}

const headerElement = document.getElementById( "header" );
const contentElement = document.getElementById( "content" );

const updateContent = () => {
    headerElement.innerHTML = root.getHeaderHtml();
    contentElement.innerHTML = root.activeSection.getHtml();
};

const root = new Root();
root.createSection( Section1, "Section 1" );
root.createSection( Section2, "Section 2" );
root.createSection( Section3, "Section 3" );

root.sections[ 0 ].active = true;
updateContent();

headerElement.addEventListener( "click", ( e ) => {
    if( e && e.target && e.target.id && e.target.id.startsWith( "HS" ) ) {
        root.activeSection = e.target.id.replace( "H", "" );
        updateContent();
    }
} );

contentElement.addEventListener( "click", ( e ) => {
    if( e && e.target && e.target.id && e.target.id.startsWith( "CS" ) ) {

        if( e.target.id.endsWith( "Link" ) ) {
            const groupId = e.target.id.substring( 1, e.target.id.indexOf( "Link" ) );
            const targetGroup = root.activeSection.items.find( ( i ) => i.id === groupId );
            if( targetGroup ) {
                targetGroup.click();
            }
        } else {
            const groupId = e.target.id.substring( 1, e.target.id.indexOf( "GI" ) );
            const targetGroup = root.activeSection.items.find( ( i ) => i.id === groupId );

            if( targetGroup ) {
                const itemId = e.target.id.substring( 1, e.target.id.length );
                const targetItem = targetGroup.items.find( ( i ) => i.id === itemId );

                if( targetItem ) {
                    targetItem.click();
                }
            }
        }
    }
} );