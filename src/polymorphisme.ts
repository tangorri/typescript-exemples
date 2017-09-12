// Exemple de mise en oeuvre de polymorphisme
// Le but est d'avoir un système flexible quand
// à l'ajout de nouveau de type de question
// On définie est instancie des Types de Questions 
// héritant d'une base commune. On peut ensuite dans certains
// cas traiter l'ensemble des questions d'une manière commune
// (voir à la fin le code d'affichage)
//
// note : la classe Question est asbtraite, on ne peut l'intancier
// elle ne sert que de socles aux Classe enfants.
abstract class AQuestion {
  // on créer les propriétés en privé
  // TS permet de faire ce raccourci
  // par conventions on préfix _ les propriétés privées.
  constructor(
    private _id: number,
    private _titre: string,
    private _enonce: string
  ) {
  }

  // la méthode afficher sera disponible dans l'interface commune
  // mais écraser par le code des classes enfants. On est donc
  // certains qu'un appel de cette méthode est possible quelque soit 
  // la classe enfant réellement référencée.
  public afficher(): Element[] {
    const titreElem = document.createElement('header');
    titreElem.innerText = this._titre;
    const ennonceElem = document.createElement('div');
    ennonceElem.innerText = this._enonce;
    return [titreElem, ennonceElem];
  }

  // get est un moyen de créer un accesseur en lecture
  // on y accèdes via question.id, pour l'écriture on ferai 
  // set id (value:number):void 
  public get id(): number {
    return this._id;
  }
}

// Classe enfant réellement instanciable
// ici on dit que réponse est un simple champs text.
// on proposera un input[text]
class QuestionResponseLibre extends AQuestion {
  
  // on surcharge (override) la méthode pour donner une spéficité
  public afficher(): Element[] {
    const vue = super.afficher().concat(document.createElement('input'));
    return vue;
  }
}

// Autres classe instanciable
// ici la réponse sera une énumaration
class QCM extends AQuestion {
  
  // on ajoute des propriétés via le ctor
  constructor(id: number, titre: string, enoncé: string, private _choix: string[]) {
    // on appel tout de même le ctor de base
    super(id, titre, enoncé);
  }

  // spéficication : afficher (une liste de input[radio])
  public afficher(): Element[] {
    
    // Avec map on créer un tableau depuis un autre.
    // on retourne la correspondance entre les valeurs 
    // du tableau source et destination.
    const inputs = this._choix.map((item) => {
      const label = document.createElement('label');
      label.innerText = item;
      const inputList = document.createElement('ul');
      const input = document.createElement('input');
      input.type = 'radio';
      input.value = item;
      input.name = `qcm-${this.id}`;
      label.appendChild(input);
      return label;
    });

    // on retourne l'affichage de base et la réponse spécifique
    return super.afficher().concat(inputs);
  }
}

// instanciations
const q = new QuestionResponseLibre(42, 'Le pigeon',
  'Quelle est la différence entre un pigeons');

const qcm = new QCM(412, 'JS typage', 'En JS le typage des variables',
  ['pas de type', 'typage dynamique et faible', 'fortement typé et statique']);

// ICI intervient le polymorphisme. objets q et qcm, sont des QuestionReponseLibre et QCM, 
// mais également des Question, par héritage
// on les voite donc de 'loin', cela ne transtype pas, c'est un moyen
// de ne pase se limiter à certaines mais plutot tout ce qui hérite de Question.
const questions: AQuestion[] = [q, qcm];


// Afficher liste des questions, quelque soit leur type réelle
// il suffit qu'elle soit bien des enfant de la Classe Question
questions.forEach((item: AQuestion) => {
  item.afficher().forEach((node: Node) => {
    document.body.appendChild(node);
  });
});