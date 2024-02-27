export default function ImagePicker({images, selectedImage, onSelect}){
    return (
        <div id="image-picker">
            <p>Select an Image</p>
            <ul>{
            images.map(image => (
                <li key={image.id} onClick={() => onSelect(image.path)} className={selectedImage === image.path? 'seleted': undefined}><img src={`http://localhost:3000/${image.path}`} alt={image.caption}/></li>
            ))}
            </ul>
        </div>
    )
}