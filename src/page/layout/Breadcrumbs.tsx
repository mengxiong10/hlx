import { Breadcrumbs as BreadcrumbComponent, Link, Typography } from '@mui/material';
import { matchRoutes, useLocation } from 'react-router-dom';
import { routesConfig } from 'src/Routes';

export interface BreadcrumbsProps {
  replaceBreadcrumbs?: (breadcrumbs: BreadcrumbLink[]) => BreadcrumbLink[];
}

export interface BreadcrumbLink {
  name: string | React.ReactNode;
  path: string;
}

export function Breadcrumbs({ replaceBreadcrumbs }: BreadcrumbsProps) {
  const location = useLocation();

  let breadcrumbs: BreadcrumbLink[] = (matchRoutes(routesConfig, location) || [])
    .filter((v) => v.route.breadcrumbName)
    .map((cur) => {
      return { name: cur.route.breadcrumbName!, path: cur.pathname };
    });

  if (replaceBreadcrumbs) {
    breadcrumbs = replaceBreadcrumbs(breadcrumbs);
  }

  const list = breadcrumbs.map((item, index) => {
    if (index !== breadcrumbs.length - 1) {
      return (
        <Link underline="hover" key={item.path} color="inherit" href={item.path}>
          {item.name}
        </Link>
      );
    }
    return (
      <Typography variant="h6" key={item.path} fontSize="1rem" color="text.primary">
        {item.name}
      </Typography>
    );
  });

  return <BreadcrumbComponent aria-label="breadcrumb">{list}</BreadcrumbComponent>;
}
