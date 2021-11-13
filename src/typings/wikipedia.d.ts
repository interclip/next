interface WikipediaArticle {
  pageid: number;
  ns: number;
  title: string;
  images: {
    ns: number;
    description: string;
  }[];
}

interface WikipediaResponse {
  batchcomplete: string;
  continue: {
    grncontinue: string;
    continue: string;
  };
  warnings: any;
  query: {
    pages: {
      [key: string]: WikipediaArticle;
    };
  };
}
