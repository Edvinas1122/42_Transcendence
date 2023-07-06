import { AuthCodeDTO } from '@/lib/DTO/AuthData';
import { QRCode } from './client-utils';

const TwoFAUI = ({token}: {token: AuthCodeDTO}) => {

    return(
        <div>
            <QRCode token={token}/>
        </div>
    );
}                          

export default TwoFAUI;