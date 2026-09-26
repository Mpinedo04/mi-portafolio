import settings from './settings';
import home from './home';
import about from './about';
import workstation from './workstation';
import studies from './studies';
import project from './project';
import report from './report';
import contact from './contact';
import codeBlock from './objects/codeBlock';
import reportImage from './objects/reportImage';
import reportTable from './objects/reportTable';
import downloadLink from './objects/downloadLink';

export const singletonTypes = ['settings', 'home', 'about', 'workstation', 'studies', 'contact'];
export const schemaTypes = [settings, home, about, workstation, studies, project, report, contact, codeBlock, reportImage, reportTable, downloadLink];
