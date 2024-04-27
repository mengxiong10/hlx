import { Navigate, useRoutes, RouteObject } from 'react-router-dom';
import { AuthProvider } from 'src/auth/AuthProvider';
import { AuthRequired } from './auth/AuthRequired';
import { AuthRoute } from './AuthRoute';
import { LoginPage } from './page/login';
import { Layout } from './page/layout/Layout';
import { AllTextbook, OwnTextbook } from './page/textbook';
import { Textbook } from './page/textbook/Textbook';
import { Study } from './page/study';
import { Unit } from './page/textbook/Unit';
import { StudyRecord } from './page/studyRecord';
import { Feedback } from './page/feedback';
import { ExamList } from './page/examList';
import { ExamDetail } from './page/exam';
import { ExamRecord } from './page/examRecord';
import { RegisterPage } from './page/login/Register';
import { MessageList } from './page/message';
import { Rebate } from './page/rebate';

declare module 'react-router-dom' {
  interface RouteObject {
    breadcrumbName?: string | React.ReactNode;
  }
}

export const generateStudyPath = ({ stepId, stepValue }: { stepId: string; stepValue: string }) => {
  return `step/${stepId}/${stepValue}`;
};

export const routesConfig: RouteObject[] = [
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  {
    path: '/',
    element: (
      <AuthRequired>
        <AuthRoute />
      </AuthRequired>
    ),
    children: [
      {
        path: '/exam/:id',
        element: <ExamDetail />,
      },
      {
        element: <Layout />,
        children: [
          { index: true, element: <Navigate to="textbook" replace /> },
          { path: 'textbook', element: <OwnTextbook />, breadcrumbName: '已报课程' },
          { path: 'alltextbook', element: <AllTextbook />, breadcrumbName: '免费课程' },
          ...['textbook', 'alltextbook'].map((prefix) => ({
            path: `${prefix}/:type/:textbookId`,
            element: <Textbook />,
            children: [
              {
                path: 'unit/:unitId',
                element: <Unit />,
                children: [
                  {
                    path: generateStudyPath({ stepId: ':stepId', stepValue: ':stepValue' }),
                    element: <Study />,
                  },
                ],
              },
            ],
          })),
          { path: 'history', element: <StudyRecord />, breadcrumbName: '学习记录' },
          { path: 'feedback', element: <Feedback />, breadcrumbName: '师生互动' },
          { path: 'exams', element: <ExamList />, breadcrumbName: '现在测试' },
          { path: 'recordExam', element: <ExamRecord />, breadcrumbName: '测试记录' },
          {
            path: 'message',
            element: <MessageList />,
            breadcrumbName: '系统通知',
          },
          {
            path: 'rebate',
            element: <Rebate />,
            breadcrumbName: '我的奖金',
          },
        ],
      },
    ],
  },
];

export function Routes() {
  const element = useRoutes(routesConfig);
  return <AuthProvider>{element}</AuthProvider>;
}
