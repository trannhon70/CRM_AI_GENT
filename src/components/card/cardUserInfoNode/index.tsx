import React from 'react';


interface Props {
    item: {
        browser?: string;
        device?: string;
        city?: string;
        id?: string;
        name?: string;
        message?: any;
        gclid?: any;
    };
    index: number;
    status?: string
}

const CardUserInfoNode: React.FC<Props> = (props) => {



    const onClickItem = async () => {

    }

    return (
        <div onClick={onClickItem} className="flex items-center gap-1" title={`1`}>

            <div className={` flex items-center gap-1`}>

                <div
                    className={`flex items-center justify-center w-[20px] h-[20px] bg-red-600 text-white rounded-full text-sm`}
                >
                    1
                </div>


                <span style={{ color: "black" }}>chat a</span>
            </div>


        </div>
    );
};

export default React.memo(CardUserInfoNode);
