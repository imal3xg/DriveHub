export interface Media {
    data: {
        id: number;
        attributes: {
            formats: {
                large: FormatoImagen;
                small: FormatoImagen;
                medium: FormatoImagen;
                thumbnail: FormatoImagen;
            };
        };
    };
}

interface FormatoImagen {
    url: string;
}