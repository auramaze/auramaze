const PrevArrow = (props) => {
    const {onClick} = props;
    return <div
        onClick={onClick}
        style={{
            zIndex: 100,
            position: 'absolute',
            left: -15,
            top: '50%',
            transform: 'translate(0, -50%)',
            color: '#666666',
            fontSize: 20,
            cursor: 'pointer'
        }}>
        <FontAwesomeIcon icon={faAngleLeft} size="lg"/>
    </div>;
};

export default PrevArrow;
