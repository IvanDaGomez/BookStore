import ReactImageMagnify from "react-image-magnify"
export function ZoomImage({ src, width, zoomConst }) {
    return (
        <div style={{ width }}> {/* Ajusta el tamaño base */}
            <ReactImageMagnify
                {...{
                    smallImage: {
                        alt: 'Harry Potter y la Cámara Secreta',
                        isFluidWidth: true,
                        src: src,
                    },
                    largeImage: {
                        src: src,
                        width: 1200, // Resolución más grande para la imagen aumentada
                        height: 1800,
                    },
                    enlargedImagePosition: 'over', // El zoom aparece sobre la imagen
                    enlargedImageContainerDimensions: {
                        width: zoomConst, // Zoom personalizado
                        height: zoomConst,
                    },
                }}
            />
        </div>
    );
}